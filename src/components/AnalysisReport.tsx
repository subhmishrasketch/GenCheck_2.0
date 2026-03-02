import { FileText, Bot, AlertTriangle, CheckCircle, Quote, Lightbulb, FileSearch, BarChart3, PenLine, ShieldCheck, Layers, Brain, Eye, Crown, Wand2, RefreshCw, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisReportProps {
  result: any;
  fileName: string;
  fileSize: number;
  onReset: () => void;
}

const AnalysisReport = ({ result, fileName, fileSize, onReset }: AnalysisReportProps) => {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];
  
  const pieData = [
    { name: 'AI Generated', value: result.aiProbability },
    { name: 'Human Made', value: result.humanProbability },
  ];

  const scoresData = [
    { name: 'Writing Style', score: result.detailedScores?.writingStyle || 0, fill: 'hsl(var(--primary))' },
    { name: 'Content Depth', score: result.detailedScores?.contentDepth || 0, fill: 'hsl(221, 83%, 63%)' },
    { name: 'Structure', score: result.detailedScores?.structuralPatterns || 0, fill: 'hsl(262, 83%, 58%)' },
    { name: 'Vocabulary', score: result.detailedScores?.vocabularyAnalysis || 0, fill: 'hsl(262, 83%, 68%)' },
    { name: 'Originality', score: result.detailedScores?.originalityScore || 0, fill: 'hsl(142, 71%, 45%)' },
    { name: 'Natural Lang.', score: result.detailedScores?.naturalLanguage || 0, fill: 'hsl(142, 71%, 55%)' },
    { name: 'Consistency', score: result.detailedScores?.consistencyScore || 0, fill: 'hsl(221, 83%, 73%)' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-destructive';
    if (score >= 50) return 'text-amber-500';
    return 'text-green-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-destructive/10 border-destructive/20';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* File Info Header */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6 flex items-center gap-4 animate-fade-up">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{fileName}</h3>
            <p className="text-sm text-muted-foreground">
              {(fileSize / 1024 / 1024).toFixed(2)} MB • Analysis Complete
            </p>
          </div>
          <Button variant="outline" onClick={onReset}>
            Analyze Another
          </Button>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* AI vs Human Pie Chart */}
          <div className="bg-card rounded-2xl border border-border p-6 animate-fade-up delay-100">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              AI vs Human Analysis
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ value }) => `${value}%`}>
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detected AI Tool */}
          <div className="bg-card rounded-2xl border border-border p-6 animate-fade-up delay-200">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Tool Detection
            </h3>
            {result.detectedAITool && result.detectedAITool !== "None" && result.detectedAITool !== "Unknown" ? (
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 text-center">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold gradient-text mb-2">{result.detectedAITool}</h4>
                <p className="text-muted-foreground">Confidence: {result.aiToolConfidence}%</p>
                <Progress value={result.aiToolConfidence} className="h-2 mt-3" />
              </div>
            ) : (
              <div className="bg-green-500/10 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-green-600 mb-2">
                  {result.aiProbability > 50 ? "Unknown AI Tool" : "Likely Human-Made"}
                </h4>
                <p className="text-muted-foreground">
                  {result.aiProbability > 50 ? "AI detected but specific tool unclear" : "Content appears to be human-authored"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Analysis Sections */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="slides" className="text-xs sm:text-sm">Slide Scores</TabsTrigger>
            <TabsTrigger value="nlp" className="text-xs sm:text-sm">NLP Analysis</TabsTrigger>
            <TabsTrigger value="humanize" className="text-xs sm:text-sm">Humanize</TabsTrigger>
            <TabsTrigger value="pro" className="text-xs sm:text-sm flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Pro
            </TabsTrigger>
            <TabsTrigger value="explainable" className="text-xs sm:text-sm">Explainable AI</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Findings */}
            {result.keyFindings && result.keyFindings.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Key Findings
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.keyFindings.map((finding: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-sm text-foreground">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Scores Bar Chart */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Detailed Analysis Scores
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Higher = more AI-like (except Originality & Natural Language where higher = more human)</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoresData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detected Phrases */}
            {result.detectedPhrases && result.detectedPhrases.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-primary" />
                  Detected Phrases
                </h3>
                <div className="space-y-3">
                  {result.detectedPhrases.map((item: any, index: number) => (
                    <div key={index} className={`rounded-lg p-4 border ${item.type === 'ai' ? 'bg-destructive/5 border-destructive/20' : 'bg-green-500/5 border-green-500/20'}`}>
                      <div className="flex items-start gap-3">
                        {item.type === 'ai' ? <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-medium text-foreground italic">"{item.phrase}"</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI & Human Indicators */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-6">
                <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  AI Indicators
                </h3>
                <ul className="space-y-2">
                  {result.indicators?.aiIndicators?.map((indicator: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-destructive mt-1">•</span>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-500/5 rounded-2xl border border-green-500/20 p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Human Indicators
                </h3>
                <ul className="space-y-2">
                  {result.indicators?.humanIndicators?.map((indicator: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-green-600 mt-1">•</span>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Slide-wise Scores Tab */}
          <TabsContent value="slides" className="mt-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Slide-wise AI Scores
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Individual AI probability for each slide/section</p>
              {result.slideScores && result.slideScores.length > 0 ? (
                <div className="space-y-4">
                  {result.slideScores.map((slide: any, index: number) => (
                    <div key={index} className={`rounded-xl border p-4 ${getScoreBg(slide.aiScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold">
                            {slide.slideNumber || index + 1}
                          </span>
                          <h4 className="font-semibold text-foreground">{slide.title || `Section ${index + 1}`}</h4>
                        </div>
                        <span className={`text-2xl font-bold ${getScoreColor(slide.aiScore)}`}>
                          {slide.aiScore}%
                        </span>
                      </div>
                      <Progress value={slide.aiScore} className="h-2 mb-3" />
                      {slide.flaggedContent && (
                        <p className="text-sm text-muted-foreground italic mb-1">
                          <span className="font-medium text-foreground">Flagged: </span>"{slide.flaggedContent}"
                        </p>
                      )}
                      {slide.explanation && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Why: </span>{slide.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No slide-level data available for this document.</p>
              )}
            </div>
          </TabsContent>

          {/* NLP Analysis Tab */}
          <TabsContent value="nlp" className="space-y-6 mt-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                NLP-Based Content Analysis
              </h3>
              {result.nlpAnalysis ? (
                <div className="space-y-6">
                  {/* NLP Score Cards */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Tone Uniformity</p>
                      <p className={`text-3xl font-bold ${getScoreColor(result.nlpAnalysis.toneUniformity)}`}>
                        {result.nlpAnalysis.toneUniformity}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Higher = more AI-like</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Repetition Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(result.nlpAnalysis.repetitionScore)}`}>
                        {result.nlpAnalysis.repetitionScore}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Higher = more repetitive</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Vocabulary Diversity</p>
                      <p className={`text-3xl font-bold ${getScoreColor(100 - result.nlpAnalysis.vocabularyDiversity)}`}>
                        {result.nlpAnalysis.vocabularyDiversity}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Higher = more diverse</p>
                    </div>
                  </div>

                  {/* NLP Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Sentence Variety</p>
                        <p className="text-foreground capitalize">{result.nlpAnalysis.sentenceVariety}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Formality Level</p>
                        <p className="text-foreground capitalize">{result.nlpAnalysis.formality}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Writing Style Notes</p>
                      <p className="text-foreground text-sm">{result.nlpAnalysis.writingStyleNotes}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">NLP analysis not available.</p>
              )}
            </div>

            {/* Pattern Analysis */}
            {result.patternAnalysis && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-primary" />
                  Pattern Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Repetitive Structures</p>
                    <p className="text-foreground">{result.patternAnalysis.repetitiveStructures || "Not analyzed"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transition Usage</p>
                    <p className="text-foreground">{result.patternAnalysis.transitionUsage || "Not analyzed"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Personal Touches</p>
                    <p className="text-foreground capitalize">{result.patternAnalysis.personalTouches || "Not analyzed"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata & Design Check */}
            {result.metadataDesignCheck && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Metadata & Design Pattern Check
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Template Detected</p>
                      <p className="text-foreground">{result.metadataDesignCheck.templateDetected}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Creator Software</p>
                      <p className="text-foreground">{result.metadataDesignCheck.creatorSoftware}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Timestamp Analysis</p>
                      <p className="text-foreground">{result.metadataDesignCheck.timestampAnalysis}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Layout Pattern</p>
                      <p className="text-foreground">{result.metadataDesignCheck.layoutPattern}</p>
                    </div>
                    {result.metadataDesignCheck.designSignatures && result.metadataDesignCheck.designSignatures.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Design Signatures</p>
                        <ul className="space-y-1 mt-1">
                          {result.metadataDesignCheck.designSignatures.map((sig: string, i: number) => (
                            <li key={i} className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>{sig}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Humanization Suggestions Tab */}
          <TabsContent value="humanize" className="mt-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" />
                Humanization Suggestions
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Actionable changes to make content appear more human-written</p>
              {result.humanizationSuggestions && result.humanizationSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {result.humanizationSuggestions.map((suggestion: any, index: number) => (
                    <div key={index} className="rounded-xl border border-border bg-secondary/30 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {suggestion.section}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Original</p>
                          <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                            <p className="text-sm text-foreground italic">"{suggestion.original}"</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Suggested Rewrite</p>
                          <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                            <p className="text-sm text-foreground italic">"{suggestion.suggestion}"</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        <span className="font-medium text-foreground">Why: </span>{suggestion.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No humanization suggestions available.</p>
              )}
            </div>
          </TabsContent>

          {/* Pro Section - Detailed Content Changes */}
          <TabsContent value="pro" className="mt-6 space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Pro Content Advisor</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Detailed, slide-by-slide guidance on exactly what to change, rewrite, or remove to make your presentation appear fully human-crafted.
              </p>
            </div>

            {/* What to Rewrite */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Content to Rewrite
              </h3>
              <p className="text-sm text-muted-foreground mb-4">These sections sound AI-generated. Rewrite them in your own voice.</p>
              {result.humanizationSuggestions && result.humanizationSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {result.humanizationSuggestions.map((s: any, i: number) => (
                    <div key={i} className="rounded-xl border border-border bg-secondary/30 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{s.section}</span>
                        <span className="px-3 py-1 bg-destructive/10 text-destructive text-xs font-semibold rounded-full">Rewrite</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Current (AI-sounding)</p>
                          <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                            <p className="text-sm text-foreground italic">"{s.original}"</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Human Alternative</p>
                          <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                            <p className="text-sm text-foreground italic">"{s.suggestion}"</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        <span className="font-medium text-foreground">Why it's flagged: </span>{s.reason}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No rewrites needed — content looks human!</p>
              )}
            </div>

            {/* What to Remove */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Content to Remove or Simplify
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Over-polished filler phrases that AI loves to add. Remove or simplify these.</p>
              {result.detectedPhrases && result.detectedPhrases.filter((p: any) => p.type === 'ai').length > 0 ? (
                <div className="space-y-3">
                  {result.detectedPhrases.filter((p: any) => p.type === 'ai').map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-destructive/5 border border-destructive/10 rounded-lg p-4">
                      <Trash2 className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground italic">"{item.phrase}"</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No filler content detected.</p>
              )}
            </div>

            {/* Structural Tips */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Structural Improvements
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Make the structure feel more natural and less template-driven.</p>
              <div className="space-y-3">
                {result.indicators?.aiIndicators?.map((indicator: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/10 rounded-lg p-4">
                    <span className="w-6 h-6 bg-amber-500/20 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-sm text-foreground">{indicator}</p>
                      <p className="text-xs text-muted-foreground mt-1">Address this to reduce AI detection score</p>
                    </div>
                  </div>
                ))}
                {(!result.indicators?.aiIndicators || result.indicators.aiIndicators.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No structural issues found.</p>
                )}
              </div>
            </div>

            {/* Quick Checklist */}
            <div className="bg-gradient-to-r from-green-500/10 to-accent/10 rounded-2xl border border-green-500/20 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Quick Humanization Checklist
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Add personal anecdotes or examples",
                  "Vary sentence length (mix short & long)",
                  "Use casual transitions, not formal ones",
                  "Include minor imperfections or colloquial phrases",
                  "Reference specific data/sources you actually used",
                  "Break the template — rearrange slide order",
                  "Add your own visuals or hand-drawn elements",
                  "Remove generic buzzwords and filler",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Explainable AI Report Tab */}
          <TabsContent value="explainable" className="mt-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Explainable AI Report
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Transparent reasoning for every flagged finding</p>
              {result.explainableReport && result.explainableReport.length > 0 ? (
                <div className="space-y-4">
                  {result.explainableReport.map((item: any, index: number) => (
                    <div key={index} className={`rounded-xl border p-5 ${getScoreBg(item.confidence)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-foreground flex-1">{item.finding}</h4>
                        <span className={`text-lg font-bold ml-4 ${getScoreColor(item.confidence)}`}>
                          {item.confidence}%
                        </span>
                      </div>
                      {item.evidence && (
                        <div className="bg-background/50 rounded-lg p-3 mb-3 border border-border">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Evidence</p>
                          <p className="text-sm text-foreground italic">"{item.evidence}"</p>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No explainable report data available.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
          <p className="text-foreground">{result.summary}</p>
        </div>
      </div>
    </section>
  );
};

export default AnalysisReport;
