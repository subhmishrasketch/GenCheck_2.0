import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";
import AuthGate from "@/components/AuthGate";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {loading ? null : user ? <UploadZone /> : <AuthGate />}
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
