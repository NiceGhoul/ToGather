import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/ui/card';
import Layout_User from '@/Layouts/Layout_User';
import { Heart, Search, Gift, Users, Target } from 'lucide-react';

export default function Create({ campaign, campaigns }) {
    const [formData, setFormData] = useState({
        campaign_id: campaign?.id || '',
        amount: '',
        message: '',
        anonymous: false
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(campaign);

    // Format number to Rupiah
    const formatRupiah = (amount) => {
        if (!amount) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Search campaigns when no campaign is pre-selected
    useEffect(() => {
        if (!campaign && searchQuery.length > 2) {
            fetch(`/api/search-campaigns?q=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => setSearchResults(data));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, campaign]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.snap_token) {
                // Open Midtrans payment popup
                window.snap.pay(data.snap_token, {
                    onSuccess: function(result) {
                        alert('Payment successful!');
                        window.location.href = '/donate?success=1';
                    },
                    onPending: function(result) {
                        alert('Payment pending. Please complete your payment.');
                    },
                    onError: function(result) {
                        alert('Payment failed. Please try again.');
                    },
                    onClose: function() {
                        alert('Payment popup closed.');
                    }
                });
            }
        } catch (error) {
            alert('Error processing payment');
        }
    };

    const selectCampaign = (selectedCamp) => {
        setSelectedCampaign(selectedCamp);
        setFormData(prev => ({ ...prev, campaign_id: selectedCamp.id }));
        setSearchQuery('');
        setSearchResults([]);
    };

    const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

    return (
        <Layout_User>
            <div className="min-h-screen bg-gray-50 py-4 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1 dark:text-white">Make a Donation</h1>
                        <p className="text-gray-600 dark:text-white">Your generosity can make a real difference in someone's life</p>
                    </div>

                    <Card className="shadow-lg border-0">
                    
                        <CardContent className="p-5">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Campaign Selection */}
                                <div className="space-y-3 lg:col-span-2">
                                    <Label className="text-base font-semibold flex items-center gap-2 dark:text-white">
                                        <Target className="w-4 h-4 text-gray-600 dark:text-white" />
                                        Select Campaign
                                    </Label>
                                    {selectedCampaign ? (
                                        <Card className="bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-600">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center ">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">{selectedCampaign.title}</h3>
                                                        <p className="text-sm text-gray-600 mt-1 dark:text-white">Selected Campaign</p>
                                                    </div>
                                                    {!campaign && (
                                                        <Button 
                                                            className="dark:bg-gray-600"
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedCampaign(null);
                                                                setFormData(prev => ({ ...prev, campaign_id: '' }));
                                                            }}
                                                        >
                                                            Change
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 dark:bg-gray-900 dark:border-gray-600" />
                                                <Input
                                                    className="pl-10"
                                                    placeholder="Search for a campaign to support..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            {searchResults.length > 0 && (
                                                <Card className="max-h-48 overflow-y-auto">
                                                    {searchResults.map((camp) => (
                                                        <div
                                                            key={camp.id}
                                                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors"
                                                            onClick={() => selectCampaign(camp)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                                <span className="font-medium">{camp.title}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Card>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Amount */}
                                <div className="space-y-4">
                                    <Label htmlFor="amount" className="text-base font-semibold flex items-center gap-2 dark:text-white">
                                        <Gift className="w-4 h-4 text-gray-600 dark:text-white" />
                                        Donation Amount
                                    </Label>
                                    
                                    {/* Preset Amount Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {presetAmounts.map((amount) => (
                                            <Button
                                                key={amount}
                                                type="button"
                                                variant={formData.amount == amount ? "default" : "outline"}
                                                className={`h-12 text-sm font-medium transition-all ${
                                                    formData.amount == amount 
                                                        ? 'bg-gray-900 text-white shadow-md dark:bg-gray-700' 
                                                        : 'hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                                onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                                            >
                                                {formatRupiah(amount)}
                                            </Button>
                                        ))}
                                    </div>
                                    
                                    {/* Custom Amount Input */}
                                    <div className="space-y-3">
                                        <Label htmlFor="amount" className="text-sm text-gray-600 dark:text-white">Or enter custom amount:</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            min="1000"
                                            step="1000"
                                            placeholder="Enter amount in Rupiah"
                                            value={formData.amount}
                                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            className="text-lg font-medium"
                                            required
                                        />
                                        <div className="p-2 bg-gray-100 rounded border border-gray-200">
                                            <p className="text-gray-700 font-medium text-sm text-center">
                                                You're donating: {formatRupiah(formData.amount || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-3">
                                    <Label htmlFor="message" className="text-base font-semibold flex items-center gap-2 dark:text-white">
                                        <Users className="w-4 h-4 text-gray-600 dark:text-white" />
                                        Personal Message <span className="text-sm font-normal text-gray-500">(Optional)</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Share why this cause matters to you or leave an encouraging message..."
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        maxLength={500}
                                        rows={9}
                                        className="resize-none"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-white">
                                        <span>Your message will be shared with the campaign organizer</span>
                                        <span>{formData.message.length}/500</span>
                                    </div>
                                    
                                    {/* Anonymous Option */}
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded border mt-4 dark:bg-gray-800 dark:border-gray-600">
                                        <Checkbox
                                            id="anonymous"
                                            checked={formData.anonymous}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked }))}
                                        />
                                        <div>
                                            <Label htmlFor="anonymous" className="text-sm cursor-pointer font-medium dark:text-white">
                                                Donate anonymously
                                            </Label>
                                            <p className="text-xs text-gray-600 mt-1 dark:text-white">
                                                Your name won't be displayed publicly with this donation
                                            </p>
                                        </div>
                                    </div>
                                </div>


                            </form>
                        </CardContent>
                        
                        <CardFooter className="p-5">
                            <Button 
                                type="submit" 
                                onClick={handleSubmit}
                                className="w-full h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 shadow-md transition-all duration-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-800"
                                disabled={!formData.campaign_id || !formData.amount}
                            >
                                <Heart className="w-4 h-4 mr-2" />
                                Donate {formatRupiah(formData.amount || 0)}
                            </Button>
                        </CardFooter>
                    </Card>
                    
                    {/* Trust Indicators */}
                    <div className="mt-6 text-center">
                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>100% Goes to Campaign</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Tax Deductible</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout_User>
    );
}