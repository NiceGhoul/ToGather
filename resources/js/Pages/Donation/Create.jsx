import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import Layout_User from '@/Layouts/Layout_User';

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

    return (
        <Layout_User>
            <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-center mb-6">Make a Donation</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Campaign Selection */}
                            <div>
                                <Label className="mb-3 ml-1">Campaign</Label>
                                {selectedCampaign ? (
                                    <div className="p-3 bg-blue-50 rounded-lg border">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{selectedCampaign.title}</span>
                                            {!campaign && (
                                                <Button 
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
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Search for a campaign..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchResults.length > 0 && (
                                            <div className="border rounded-lg max-h-48 overflow-y-auto">
                                                {searchResults.map((camp) => (
                                                    <div
                                                        key={camp.id}
                                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                        onClick={() => selectCampaign(camp)}
                                                    >
                                                        {camp.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <Label htmlFor="amount" className="mb-3 ml-1">Donation Amount (Rp)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="1000"
                                    step="1000"
                                    placeholder="50000"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    required
                                />
                                {formData.amount && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {formatRupiah(formData.amount)}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <Label htmlFor="message" className="mb-3 ml-1">Message (Optional)</Label>
                                <textarea
                                    id="message"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Leave a message for the campaign..."
                                    value={formData.message}
                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    maxLength={500}
                                    rows={3}
                                />
                            </div>

                            {/* Anonymous */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="anonymous"
                                    checked={formData.anonymous}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked }))}
                                />
                                <Label htmlFor="anonymous">Donate anonymously</Label>
                            </div>

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={!formData.campaign_id || !formData.amount}
                        >
                            Donate {formatRupiah(formData.amount || 0)}
                        </Button>
                    </form>
                </div>
            </div>
            </div>
        </Layout_User>
    );
}