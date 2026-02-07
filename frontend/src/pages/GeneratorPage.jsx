import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Target,
  MessageSquare,
  Star,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  Award,
  TrendingUp,
  AlertCircle,
  User,
  Briefcase,
  GraduationCap,
  Code
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Resume Templates
const RESUME_TEMPLATES = [
  { id: "professional", name: "Professional", description: "Clean and traditional format", color: "primary" },
  { id: "modern", name: "Modern", description: "Contemporary design with accents", color: "secondary" },
  { id: "creative", name: "Creative", description: "Bold and expressive layout", color: "accent" }
];

const GeneratorPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    targetRole: "",
    targetCompany: "",
    yearsExperience: "",
    currentRole: "",
    currentCompany: "",
    education: "",
    skills: "",
    achievements: "",
    additionalInfo: "",
    template: "professional"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopy = async (text, field) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateContent = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.targetRole || !formData.skills) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    setActiveStep(2);
    
    try {
      const response = await axios.post(`${API}/generate`, {
        ...formData
      });
      
      setGeneratedContent(response.data);
      setSelectedVersion(response.data.selectedVersion || 0);
      setActiveStep(3);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate content. Please try again.");
      setActiveStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    toast.success("PDF download started!");
    // In a real implementation, this would trigger PDF generation
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-primary";
    if (score >= 60) return "text-accent";
    return "text-destructive";
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: "Excellent", class: "bg-success/10 text-success" };
    if (score >= 75) return { label: "Good", class: "bg-primary/10 text-primary" };
    if (score >= 60) return { label: "Average", class: "bg-accent/10 text-accent" };
    return { label: "Needs Work", class: "bg-destructive/10 text-destructive" };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display text-lg font-semibold text-foreground">ResumeAI</span>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {[
                { num: 1, label: "Input" },
                { num: 2, label: "Generate" },
                { num: 3, label: "Review" }
              ].map((step, index) => (
                <div key={step.num} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                    activeStep === step.num 
                      ? "bg-primary text-primary-foreground" 
                      : activeStep > step.num 
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {activeStep > step.num ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-medium">
                        {step.num}
                      </span>
                    )}
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {index < 2 && <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {generatedContent && (
                <Button onClick={downloadPDF} variant="accent" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Input Form */}
        {activeStep === 1 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Your Documents</h1>
              <p className="text-muted-foreground">Fill in your details and let AI craft the perfect resume and cover letter.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="card-elevated border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                        <CardDescription>Your basic contact details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="San Francisco, CA"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Position */}
                <Card className="card-elevated border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Target Position</CardTitle>
                        <CardDescription>The role you're applying for</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetRole">Target Job Title *</Label>
                        <Input
                          id="targetRole"
                          placeholder="Senior Software Engineer"
                          value={formData.targetRole}
                          onChange={(e) => handleInputChange("targetRole", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetCompany">Target Company</Label>
                        <Input
                          id="targetCompany"
                          placeholder="Google, Inc."
                          value={formData.targetCompany}
                          onChange={(e) => handleInputChange("targetCompany", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card className="card-elevated border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Experience</CardTitle>
                        <CardDescription>Your professional background</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearsExperience">Years of Experience</Label>
                        <Select 
                          value={formData.yearsExperience} 
                          onValueChange={(value) => handleInputChange("yearsExperience", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentRole">Current Role</Label>
                        <Input
                          id="currentRole"
                          placeholder="Software Engineer"
                          value={formData.currentRole}
                          onChange={(e) => handleInputChange("currentRole", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentCompany">Current Company</Label>
                        <Input
                          id="currentCompany"
                          placeholder="Tech Corp"
                          value={formData.currentCompany}
                          onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills & Education */}
                <Card className="card-elevated border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Code className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Skills & Education</CardTitle>
                        <CardDescription>Your qualifications and expertise</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Key Skills *</Label>
                      <Textarea
                        id="skills"
                        placeholder="e.g., JavaScript, React, Node.js, Python, AWS, Team Leadership, Agile/Scrum..."
                        className="min-h-[80px]"
                        value={formData.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input
                        id="education"
                        placeholder="BS Computer Science, Stanford University"
                        value={formData.education}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="achievements">Key Achievements</Label>
                      <Textarea
                        id="achievements"
                        placeholder="e.g., Led a team of 5 engineers, Increased system performance by 40%, Launched product with 1M+ users..."
                        className="min-h-[80px]"
                        value={formData.achievements}
                        onChange={(e) => handleInputChange("achievements", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Any other relevant information, certifications, or notes..."
                        className="min-h-[60px]"
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Template Selection */}
              <div className="space-y-6">
                <Card className="card-elevated border-0 sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Resume Template</CardTitle>
                    <CardDescription>Choose your preferred style</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {RESUME_TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleInputChange("template", template.id)}
                        className={`template-card p-4 rounded-xl cursor-pointer ${
                          formData.template === template.id ? "selected" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            template.color === "primary" ? "bg-primary/10 text-primary" :
                            template.color === "secondary" ? "bg-secondary/10 text-secondary" :
                            "bg-accent/10 text-accent"
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground">{template.name}</p>
                              {formData.template === template.id && (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button 
                      onClick={generateContent} 
                      className="w-full" 
                      variant="premium" 
                      size="lg"
                      disabled={!formData.fullName || !formData.targetRole || !formData.skills}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate with AI
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      * Required fields must be filled
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Generating */}
        {activeStep === 2 && isGenerating && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Creating Your Documents
              </h2>
              <p className="text-muted-foreground mb-8">
                Our AI is crafting personalized content tailored to your target role...
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing your profile...</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating resume summary...</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Crafting cover letter...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {activeStep === 3 && generatedContent && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Review Your Documents</h1>
                <p className="text-muted-foreground">AI has generated and evaluated multiple versions for you.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setActiveStep(1)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button variant="premium" onClick={downloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Version Selector */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {generatedContent.versions.map((version, index) => {
                const scoreBadge = getScoreBadge(version.evaluation.overall);
                return (
                  <Card 
                    key={index}
                    onClick={() => setSelectedVersion(index)}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedVersion === index 
                        ? "ring-2 ring-primary shadow-glow" 
                        : "hover:shadow-lg"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant="secondary" className="mb-2">Version {index + 1}</Badge>
                          <p className="font-medium text-foreground">{version.style}</p>
                        </div>
                        {generatedContent.selectedVersion === index && (
                          <Badge className="bg-success/10 text-success border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Best
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className={`w-5 h-5 ${getScoreColor(version.evaluation.overall)}`} />
                          <span className={`text-2xl font-bold ${getScoreColor(version.evaluation.overall)}`}>
                            {version.evaluation.overall}
                          </span>
                        </div>
                        <Badge className={scoreBadge.class}>{scoreBadge.label}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Document Preview */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="resume" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-6">
                    <TabsTrigger value="resume" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Resume Summary
                    </TabsTrigger>
                    <TabsTrigger value="cover" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Cover Letter
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="resume" className="mt-0">
                    <Card className="card-elevated border-0">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Professional Summary</CardTitle>
                          <CardDescription>Tailored for {formData.targetRole}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(generatedContent.versions[selectedVersion].resume, "resume")}
                        >
                          {copiedField === "resume" ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="prose-content bg-muted/30 rounded-xl p-6">
                          <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {generatedContent.versions[selectedVersion].resume}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="cover" className="mt-0">
                    <Card className="card-elevated border-0">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Cover Letter</CardTitle>
                          <CardDescription>
                            {formData.targetCompany 
                              ? `Addressed to ${formData.targetCompany}` 
                              : "Customized for your target role"}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(generatedContent.versions[selectedVersion].coverLetter, "cover")}
                        >
                          {copiedField === "cover" ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="prose-content bg-muted/30 rounded-xl p-6">
                          <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {generatedContent.versions[selectedVersion].coverLetter}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Evaluation Sidebar */}
              <div className="space-y-6">
                {/* Overall Score */}
                <Card className="card-elevated border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">Quality Evaluation</CardTitle>
                    <CardDescription>AI assessment of your documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Score Circle */}
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-3`}>
                        <span className={`text-4xl font-bold ${getScoreColor(generatedContent.versions[selectedVersion].evaluation.overall)}`}>
                          {generatedContent.versions[selectedVersion].evaluation.overall}
                        </span>
                      </div>
                      <p className="font-medium text-foreground">Overall Score</p>
                      <Badge className={getScoreBadge(generatedContent.versions[selectedVersion].evaluation.overall).class}>
                        {getScoreBadge(generatedContent.versions[selectedVersion].evaluation.overall).label}
                      </Badge>
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-4">
                      {[
                        { label: "Relevance", key: "relevance", icon: <Target className="w-4 h-4" /> },
                        { label: "Clarity", key: "clarity", icon: <CheckCircle2 className="w-4 h-4" /> },
                        { label: "Professionalism", key: "professionalism", icon: <Award className="w-4 h-4" /> },
                        { label: "Role Alignment", key: "roleAlignment", icon: <TrendingUp className="w-4 h-4" /> }
                      ].map((metric) => (
                        <div key={metric.key} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              {metric.icon}
                              {metric.label}
                            </span>
                            <span className={`font-medium ${getScoreColor(generatedContent.versions[selectedVersion].evaluation[metric.key])}`}>
                              {generatedContent.versions[selectedVersion].evaluation[metric.key]}%
                            </span>
                          </div>
                          <Progress 
                            value={generatedContent.versions[selectedVersion].evaluation[metric.key]} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Justification */}
                <Card className="card-elevated border-0">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      AI Justification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {generatedContent.versions[selectedVersion].justification}
                    </p>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="card-elevated border-0 bg-accent/5">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-1">Pro Tip</p>
                        <p className="text-sm text-muted-foreground">
                          Customize the generated content with specific achievements and metrics for even better results.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GeneratorPage;
