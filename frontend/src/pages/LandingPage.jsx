import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Award
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "GPT-4 crafts personalized resumes and cover letters tailored to your target role.",
      color: "primary"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Role Alignment",
      description: "Content automatically optimized to match job requirements and industry standards.",
      color: "secondary"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Quality Evaluation",
      description: "Each output is scored for relevance, clarity, and professionalism.",
      color: "accent"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Multiple Templates",
      description: "Choose from professional, creative, and modern resume templates.",
      color: "primary"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description: "Generate polished documents in seconds, not hours of manual work.",
      color: "secondary"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ATS-Friendly",
      description: "Templates designed to pass Applicant Tracking Systems with flying colors.",
      color: "accent"
    }
  ];

  const stats = [
    { value: "50K+", label: "Resumes Created", icon: <FileText className="w-5 h-5" /> },
    { value: "95%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "4.9/5", label: "User Rating", icon: <Star className="w-5 h-5" /> },
    { value: "30s", label: "Avg. Generation", icon: <Clock className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Software Engineer",
      company: "Tech Corp",
      content: "This tool helped me land my dream job! The AI-generated cover letter perfectly highlighted my skills.",
      avatar: "SM"
    },
    {
      name: "James Chen",
      role: "Marketing Manager",
      company: "Growth Inc",
      content: "Saved me hours of work. The resume templates are professional and the AI suggestions were spot-on.",
      avatar: "JC"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Analyst",
      company: "Analytics Pro",
      content: "The evaluation feature helped me understand what makes a great resume. Highly recommended!",
      avatar: "ER"
    }
  ];

  const steps = [
    { step: "01", title: "Enter Your Details", description: "Fill in your experience, skills, and target job role." },
    { step: "02", title: "AI Generation", description: "Our AI creates multiple tailored versions for you." },
    { step: "03", title: "Review & Select", description: "Compare outputs, view scores, and pick the best one." },
    { step: "04", title: "Export & Apply", description: "Download as PDF and start applying with confidence." }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">ResumeAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            </div>
            <Button onClick={() => navigate("/generator")} variant="premium" size="sm">
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-6 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Powered by GPT-4
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Create <span className="text-gradient-primary">Perfect</span> Resumes & Cover Letters
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                AI-powered document generation that crafts, evaluates, and selects the most effective version for your target role. Stand out from the competition.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => navigate("/generator")} variant="premium" size="xl">
                  Start Creating Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="xl">
                  View Templates
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border">
                <div className="flex -space-x-3">
                  {["SM", "JC", "ER", "DK"].map((initials, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-sm text-muted-foreground">Trusted by 50,000+ job seekers</p>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" 
                  alt="Professional success"
                  className="rounded-2xl shadow-xl w-full object-cover"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 border border-border animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Quality Score</p>
                      <p className="text-2xl font-bold text-success">95/100</p>
                    </div>
                  </div>
                </div>
                {/* Another floating element */}
                <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg p-3 border border-border animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">AI Generated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <span className="text-primary">{stat.icon}</span>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to <span className="text-gradient-primary">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven career strategies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-elevated border-0 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                    feature.color === 'primary' ? 'bg-primary/10 text-primary' :
                    feature.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Process</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-gradient-primary">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to create your perfect professional documents.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.step}</div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-1/2 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by <span className="text-gradient-primary">Professionals</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users say about their experience with ResumeAI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-elevated border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-light opacity-100" />
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                Join thousands of professionals who have transformed their career documents with AI.
              </p>
              <Button 
                onClick={() => navigate("/generator")} 
                variant="accent" 
                size="xl"
                className="shadow-accent"
              >
                Create Your Resume Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">ResumeAI</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
