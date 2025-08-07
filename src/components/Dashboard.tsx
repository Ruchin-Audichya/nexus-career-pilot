import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  TrendingUp, 
  Lightbulb, 
  User, 
  MapPin, 
  Calendar, 
  Star,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Code,
  Github,
  Zap
} from 'lucide-react';
import { ChatWidget } from '@/components/ChatWidget';
import { searchInternships, type JobResult } from '@/services/jobApi';
import { analyzeSkillGaps, generateProjectRecommendations, type SkillGapAnalysis, type ProjectRecommendation } from '@/services/aiService';

interface StudentProfile {
  name: string;
  college: string;
  branch: string;
  year: string;
  skills: string[];
  interests: string[];
}

interface DashboardProps {
  profile: StudentProfile;
}

// Mock data for demonstration
const mockInternships = [
  {
    id: 1,
    title: "Software Development Intern",
    company: "TechCorp Solutions",
    location: "Bangalore, India",
    type: "Remote",
    duration: "3-6 months",
    stipend: "₹15,000/month",
    skills: ["Python", "JavaScript", "React"],
    description: "Work on cutting-edge web applications using modern tech stack.",
    url: "#"
  },
  {
    id: 2,
    title: "AI/ML Research Intern",
    company: "DataScience Labs",
    location: "Mumbai, India",
    type: "Hybrid",
    duration: "4-6 months",
    stipend: "₹20,000/month",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    description: "Research and develop machine learning models for real-world applications.",
    url: "#"
  },
  {
    id: 3,
    title: "Full Stack Developer Intern",
    company: "StartupX",
    location: "Delhi, India",
    type: "In-office",
    duration: "6 months",
    stipend: "₹18,000/month",
    skills: ["JavaScript", "Node.js", "React", "MongoDB"],
    description: "Build scalable web applications from frontend to backend.",
    url: "#"
  }
];

const mockSkillGaps = [
  {
    role: "Software Development Engineer - 1",
    company: "Google",
    requiredSkills: ["System Design", "Data Structures", "Algorithms", "Java", "Python", "SQL"],
    matchedSkills: ["Python", "Java"],
    missingSkills: ["System Design", "Advanced Data Structures", "SQL"],
    matchPercentage: 33
  },
  {
    role: "Frontend Developer",
    company: "Microsoft",
    requiredSkills: ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Git"],
    matchedSkills: ["React", "JavaScript", "Git"],
    missingSkills: ["TypeScript", "Advanced CSS"],
    matchPercentage: 50
  }
];

const mockProjects = [
  {
    id: 1,
    title: "AI-Powered Student Assistant",
    description: "Create a chatbot that helps students with course selection and career guidance using NLP.",
    problem: "Students struggle with course selection and career planning",
    techStack: ["Python", "Flask", "NLP", "SQLite", "React"],
    difficulty: "Intermediate",
    estimatedTime: "4-6 weeks"
  },
  {
    id: 2,
    title: "Campus Event Management System",
    description: "Build a comprehensive platform for managing college events with registration and ticketing.",
    problem: "Inefficient event management in colleges",
    techStack: ["React", "Node.js", "MongoDB", "Express", "Payment Integration"],
    difficulty: "Advanced",
    estimatedTime: "6-8 weeks"
  },
  {
    id: 3,
    title: "Smart Study Planner",
    description: "Develop an intelligent study scheduler that optimizes learning based on deadlines and priorities.",
    problem: "Students need better time management tools",
    techStack: ["Python", "Machine Learning", "Flask", "React", "Calendar APIs"],
    difficulty: "Intermediate",
    estimatedTime: "3-5 weeks"
  }
];

export function Dashboard({ profile }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('internships');
  const [internships, setInternships] = useState<JobResult[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGapAnalysis[]>([]);
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API calls when you have API keys
      // For now, this will use mock data from the services
      
      // Load internships based on user profile
      const jobResults = await searchInternships({
        skills: profile.skills,
        interests: profile.interests,
        experience_level: 'internship'
      });
      setInternships(jobResults);

      // Analyze skill gaps against popular job descriptions
      const skillAnalysis = await analyzeSkillGaps(profile, [
        'Software Engineer Intern - Requires Python, Java, Data Structures, Algorithms',
        'Frontend Developer Intern - Requires React, JavaScript, HTML, CSS, Git',
        'ML Engineer Intern - Requires Python, Machine Learning, TensorFlow, Statistics'
      ]);
      setSkillGaps(skillAnalysis);

      // Generate personalized project recommendations
      const projectRecs = await generateProjectRecommendations(profile);
      setProjects(projectRecs);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fall back to mock data
      setInternships(mockInternships.map(job => ({
        id: job.id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        type: 'internship' as const,
        stipend: job.stipend,
        description: job.description,
        required_skills: job.skills,
        apply_url: job.url,
        posted_date: new Date().toISOString()
      })));
      setSkillGaps(mockSkillGaps.map(gap => ({
        role: gap.role,
        company: gap.company,
        requiredSkills: gap.requiredSkills,
        matchedSkills: gap.matchedSkills,
        missingSkills: gap.missingSkills,
        matchPercentage: gap.matchPercentage,
        recommendations: ['Learn missing skills', 'Practice coding problems', 'Build relevant projects']
      })));
      setProjects(mockProjects.map(proj => ({
        title: proj.title,
        description: proj.description,
        problemStatement: proj.problem,
        techStack: proj.techStack,
        difficulty: proj.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        estimatedTime: proj.estimatedTime,
        learningOutcomes: ['Technical skills', 'Problem solving', 'Project management']
      })));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Your AI-powered career dashboard is ready
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span>{profile.branch} • {profile.year}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.college}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 mb-8 p-1 bg-secondary/50 rounded-lg">
          {[
            { id: 'internships', label: 'Internship Matches', icon: Briefcase },
            { id: 'skills', label: 'Skill Gap Analysis', icon: TrendingUp },
            { id: 'projects', label: 'Project Ideas', icon: Lightbulb }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(id)}
              className={`flex-1 justify-start gap-2 ${
                activeTab === id ? 'gradient-primary text-white shadow-lg' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Profile Summary */}
        <Card className="glass-card p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Skills ({profile.skills.length})</p>
              <div className="flex flex-wrap gap-1">
                {profile.skills.slice(0, 6).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {profile.skills.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.skills.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Interests ({profile.interests.length})</p>
              <div className="flex flex-wrap gap-1">
                {profile.interests.slice(0, 4).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profile.interests.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'internships' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Internship Matches</h2>
              <Badge className="gradient-success text-white">
                {isLoading ? 'Loading...' : `${internships.length} matches found`}
              </Badge>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading internships...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {internships.map((internship) => (
                <Card key={internship.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{internship.title}</h3>
                        <p className="text-muted-foreground font-medium">{internship.company}</p>
                      </div>
                      <Badge className="gradient-primary text-white">
                        {internship.stipend || 'Not specified'}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{internship.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{internship.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{internship.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>High Match</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {internship.required_skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant={profile.skills.includes(skill) ? 'default' : 'outline'}
                            className={profile.skills.includes(skill) ? 'gradient-primary text-white' : ''}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  
                  <Button className="w-full gradient-primary text-white">
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing skills...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {skillGaps.map((gap, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{gap.role}</h3>
                      <p className="text-muted-foreground">{gap.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                        {gap.matchPercentage}%
                      </div>
                      <p className="text-sm text-muted-foreground">Match</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Progress value={gap.matchPercentage} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Skills You Have</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {gap.matchedSkills.map((skill) => (
                          <Badge key={skill} className="gradient-success text-white">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold">Skills to Learn</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {gap.missingSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="border-orange-500 text-orange-500">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button className="w-full gradient-accent text-black font-semibold">
                    Get Learning Roadmap
                    <TrendingUp className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
                  ))
                }
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Ideas</h2>
              <Badge className="gradient-primary text-white">
                Personalized for you
              </Badge>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Generating projects...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {projects.map((project, index) => (
                <Card key={index} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          project.difficulty === 'Beginner' ? 'border-green-500 text-green-500' :
                          project.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-500' :
                          'border-red-500 text-red-500'
                        }
                      >
                        {project.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">Problem Statement</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.problemStatement}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Tech Stack:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.map((tech) => (
                          <Badge 
                            key={tech} 
                            variant={profile.skills.includes(tech) ? 'default' : 'outline'}
                            className={profile.skills.includes(tech) ? 'gradient-primary text-white' : ''}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Estimated: {project.estimatedTime}</span>
                      </div>
                    </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      View Template
                    </Button>
                    <Button className="gradient-primary text-white flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Start Project
                    </Button>
                  </div>
                </Card>
                  ))
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Chat Widget */}
      <ChatWidget profile={profile} />
    </div>
  );
}