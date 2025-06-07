export default function Layout_LR({ children }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/LR.png')" }}
      ></div>
      
      <div className="relative z-10 w-full max-w-xl px-4">
        {children}
      </div>
    </div>
  );
}
