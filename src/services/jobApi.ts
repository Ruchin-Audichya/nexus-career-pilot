// JobAPI Service - Integration with job search APIs
// This file contains functions to fetch real internship data from job APIs

interface JobSearchParams {
  skills: string[];
  interests: string[];
  location?: string;
  experience_level?: 'internship' | 'entry_level';
}

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'full-time' | 'part-time';
  stipend?: string;
  description: string;
  required_skills: string[];
  apply_url: string;
  posted_date: string;
}

// TODO: Add your API keys here
// You can get these from:
// 1. JSearch API (RapidAPI): https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
// 2. Adzuna API: https://developer.adzuna.com/
// 3. Reed API: https://www.reed.co.uk/developers
const API_CONFIG = {
  // JSEARCH_API_KEY: 'your_jsearch_api_key_here',
  // ADZUNA_APP_ID: 'your_adzuna_app_id_here',
  // ADZUNA_API_KEY: 'your_adzuna_api_key_here',
  // REED_API_KEY: 'your_reed_api_key_here'
};

/**
 * Fetch internships from JSearch API (RapidAPI)
 * Documentation: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 */
export const fetchInternshipsFromJSearch = async (params: JobSearchParams): Promise<JobResult[]> => {
  try {
    // TODO: Uncomment and configure when you have API key
    /*
    const query = `${params.interests.join(' OR ')} internship ${params.skills.join(' ')}`;
    
    const response = await fetch('https://jsearch.p.rapidapi.com/search', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_CONFIG.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      params: {
        query,
        page: '1',
        num_pages: '1',
        date_posted: 'month',
        employment_types: 'INTERN'
      }
    });

    const data = await response.json();
    
    return data.data.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_state || job.job_country,
      type: 'internship',
      stipend: job.job_salary_range || 'Not specified',
      description: job.job_description,
      required_skills: extractSkillsFromDescription(job.job_description),
      apply_url: job.job_apply_link,
      posted_date: job.job_posted_at_datetime_utc
    }));
    */

    // Mock data for now - remove when implementing real API
    return getMockInternships(params);
  } catch (error) {
    console.error('JSearch API Error:', error);
    return getMockInternships(params);
  }
};

/**
 * Fetch internships from Adzuna API
 * Documentation: https://developer.adzuna.com/
 */
export const fetchInternshipsFromAdzuna = async (params: JobSearchParams): Promise<JobResult[]> => {
  try {
    // TODO: Uncomment and configure when you have API key
    /*
    const query = `${params.interests.join(' ')} internship`;
    
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${API_CONFIG.ADZUNA_APP_ID}&app_key=${API_CONFIG.ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(query)}&content-type=application/json`
    );

    const data = await response.json();
    
    return data.results.map(job => ({
      id: job.id.toString(),
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      type: 'internship',
      stipend: job.salary_min ? `₹${job.salary_min} - ₹${job.salary_max}` : 'Not specified',
      description: job.description,
      required_skills: extractSkillsFromDescription(job.description),
      apply_url: job.redirect_url,
      posted_date: job.created
    }));
    */

    // Mock data for now
    return getMockInternships(params);
  } catch (error) {
    console.error('Adzuna API Error:', error);
    return getMockInternships(params);
  }
};

/**
 * Extract skills from job description using basic keyword matching
 * TODO: Enhance this with AI/NLP for better skill extraction
 */
const extractSkillsFromDescription = (description: string): string[] => {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Git',
    'HTML', 'CSS', 'AWS', 'Docker', 'Machine Learning', 'Data Science',
    'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL'
  ];

  const foundSkills = commonSkills.filter(skill =>
    description.toLowerCase().includes(skill.toLowerCase())
  );

  return foundSkills;
};

/**
 * Main function to search for internships
 * Combines results from multiple APIs
 */
export const searchInternships = async (params: JobSearchParams): Promise<JobResult[]> => {
  try {
    // TODO: Enable multiple API sources when you have API keys
    const [jSearchResults] = await Promise.allSettled([
      fetchInternshipsFromJSearch(params),
      // fetchInternshipsFromAdzuna(params), // Enable when you have API key
    ]);

    const allResults: JobResult[] = [];

    if (jSearchResults.status === 'fulfilled') {
      allResults.push(...jSearchResults.value);
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = allResults.filter((job, index, self) =>
      index === self.findIndex(j => j.title === job.title && j.company === job.company)
    );

    // Sort by skill match score
    return uniqueResults.sort((a, b) => {
      const scoreA = calculateRelevanceScore(a, params);
      const scoreB = calculateRelevanceScore(b, params);
      return scoreB - scoreA;
    });

  } catch (error) {
    console.error('Job search error:', error);
    return getMockInternships(params);
  }
};

/**
 * Calculate how relevant a job is to the user's profile
 */
const calculateRelevanceScore = (job: JobResult, params: JobSearchParams): number => {
  let score = 0;

  // Check skill matches
  const userSkills = params.skills.map(s => s.toLowerCase());
  const jobSkills = job.required_skills.map(s => s.toLowerCase());
  
  const skillMatches = userSkills.filter(skill =>
    jobSkills.some(jobSkill => jobSkill.includes(skill))
  );
  score += skillMatches.length * 10;

  // Check interest matches
  const userInterests = params.interests.map(i => i.toLowerCase());
  const titleWords = job.title.toLowerCase().split(' ');
  const descriptionWords = job.description.toLowerCase();
  
  userInterests.forEach(interest => {
    if (titleWords.some(word => word.includes(interest))) score += 15;
    if (descriptionWords.includes(interest)) score += 5;
  });

  return score;
};

/**
 * Mock data for development/testing
 * Remove this when implementing real APIs
 */
const getMockInternships = (params: JobSearchParams): JobResult[] => {
  const mockJobs: JobResult[] = [
    {
      id: '1',
      title: 'Software Development Intern',
      company: 'TechCorp India',
      location: 'Bangalore, India',
      type: 'internship',
      stipend: '₹15,000 - ₹25,000/month',
      description: 'Looking for a passionate software development intern with skills in Python, JavaScript, and React.',
      required_skills: ['Python', 'JavaScript', 'React', 'Git'],
      apply_url: 'https://example.com/apply/1',
      posted_date: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'AI/ML Research Intern',
      company: 'DataScience Labs',
      location: 'Hyderabad, India',
      type: 'internship',
      stipend: '₹20,000 - ₹30,000/month',
      description: 'Exciting opportunity for AI/ML enthusiasts. Work on cutting-edge machine learning projects.',
      required_skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
      apply_url: 'https://example.com/apply/2',
      posted_date: '2024-01-14T08:30:00Z'
    },
    {
      id: '3',
      title: 'Web Development Intern',
      company: 'StartupXYZ',
      location: 'Mumbai, India',
      type: 'internship',
      stipend: '₹12,000 - ₹18,000/month',
      description: 'Join our dynamic team as a web development intern. Experience with React and Node.js preferred.',
      required_skills: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS'],
      apply_url: 'https://example.com/apply/3',
      posted_date: '2024-01-13T14:20:00Z'
    }
  ];

  // Filter based on user's interests and skills
  return mockJobs.filter(job => {
    const hasInterestMatch = params.interests.some(interest =>
      job.title.toLowerCase().includes(interest.toLowerCase()) ||
      job.description.toLowerCase().includes(interest.toLowerCase())
    );
    
    const hasSkillMatch = params.skills.some(skill =>
      job.required_skills.some(reqSkill =>
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    return hasInterestMatch || hasSkillMatch;
  });
};

// Export types for use in other components
export type { JobResult, JobSearchParams };