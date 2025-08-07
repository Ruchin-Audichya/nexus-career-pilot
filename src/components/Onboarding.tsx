import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GraduationCap, Code, Brain } from 'lucide-react';
import heroImage from '@/assets/hero-nexus.jpg';

interface StudentProfile {
  name: string;
  college: string;
  branch: string;
  year: string;
  skills: string[];
  interests: string[];
}

interface OnboardingProps {
  onComplete: (profile: StudentProfile) => void;
}

const SKILL_OPTIONS = [
  'Python', 'JavaScript', 'Java', 'C++', 'C', 'React', 'Node.js', 'HTML/CSS',
  'SQL', 'MongoDB', 'Git', 'Docker', 'AWS', 'Machine Learning', 'Data Structures',
  'Algorithms', 'System Design', 'APIs', 'Firebase', 'Flutter', 'Android', 'iOS'
];

const INTEREST_OPTIONS = [
  'AI/ML', 'Web Development', 'Mobile Development', 'Data Science', 'DevOps',
  'Cybersecurity', 'Blockchain', 'Cloud Computing', 'Game Development',
  'UI/UX Design', 'Backend Development', 'Full Stack Development'
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    college: '',
    branch: '',
    year: '',
    skills: [],
    interests: []
  });

  const handleSkillToggle = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.name && profile.college && profile.branch && profile.year;
      case 2:
        return profile.skills.length > 0;
      case 3:
        return profile.interests.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background with hero image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Project Nexus Hero" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-2xl gradient-primary">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                Project Nexus
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-2">
              Your AI Co-pilot for Career Success
            </p>
            <p className="text-muted-foreground">
              Let's build your profile to unlock personalized career guidance
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= num 
                    ? 'gradient-primary text-white shadow-lg' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                    step > num ? 'gradient-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <Card className="glass-card p-8 animate-slide-up">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Code className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                  <p className="text-muted-foreground">Tell us about your academic background</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      value={profile.college}
                      onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
                      placeholder="e.g., JECRC University Jaipur"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Branch</Label>
                      <Select value={profile.branch} onValueChange={(value) => setProfile(prev => ({ ...prev, branch: value }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                          <SelectItem value="IT">Information Technology</SelectItem>
                          <SelectItem value="ECE">Electronics & Communication</SelectItem>
                          <SelectItem value="EEE">Electrical Engineering</SelectItem>
                          <SelectItem value="MECH">Mechanical Engineering</SelectItem>
                          <SelectItem value="CIVIL">Civil Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Current Year</Label>
                      <Select value={profile.year} onValueChange={(value) => setProfile(prev => ({ ...prev, year: value }))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Your Skills</h2>
                  <p className="text-muted-foreground">Select all skills you have experience with</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={profile.skills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        profile.skills.includes(skill) 
                          ? 'gradient-primary text-white shadow-lg' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {profile.skills.length > 0 && (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Selected skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} className="gradient-primary text-white text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Your Interests</h2>
                  <p className="text-muted-foreground">What areas of technology excite you most?</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={profile.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        profile.interests.includes(interest) 
                          ? 'gradient-secondary text-white shadow-lg' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>

                {profile.interests.length > 0 && (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Selected interests:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} className="gradient-secondary text-white text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end mt-8">
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="gradient-primary text-white px-8 py-3 font-semibold hover:shadow-lg transition-all duration-300"
              >
                {step === 3 ? 'Complete Setup' : 'Next Step'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}