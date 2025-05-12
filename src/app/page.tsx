/** @format */

"use client";

import { config } from "@/lib/config";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Briefcase,
  Code,
  Cpu,
  MessageSquare,
  Phone,
} from "lucide-react";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Form handling functions
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    // Basic validation
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormStatus({
        type: "error",
        message: "Please enter a valid email address",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Reset form
      setFormState({
        name: "",
        email: "",
        message: "",
      });
      setFormStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Branding Website (TimeX)",
      description:
        "A modern branding website built using React, Node.js, Next.js, and Shadcn UI. Features include responsive design, optimized performance, and seamless user experience.",
      impact: "Enhanced brand visibility and user engagement.",
      tags: ["React", "Node.js", "Next js", "Shadcn"],
      link: "https://branding-web-demo.vercel.app/",
      image: "/branding_web.png",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A collaborative task management tool with real-time updates powered by Firebase, an intuitive drag-and-drop interface, and robust role-based permissions for team productivity.",
      impact: "Streamlined team workflows and improved task tracking.",
      tags: ["Next.js", "Redux", "Tailwind", "DnD"],
      link: "/project/task",
      image: "/task_edit.png",
    },
    {
      id: 3,
      title: "COVID-19 Tracker",
      description:
        "An interactive COVID-19 tracker providing real-time global and local statistics, dynamic charts, and geolocation-based data. Recognized as a winner in a local hackathon.",
      impact: "Improved accessibility to critical pandemic data for users.",
      tags: ["React", "Rapid API", "Chart.js", "Geolocation", "Next Js"],
      link: "https://covid19-tracker-v-2.vercel.app",
      image: "/covid_19.png",
    },
  ];

  // Skills data grouped by category
  const aiToolsSkills = [
    {
      name: "AI Development",
      icon: <Cpu className="w-5 h-5" />,
      level: "Intermediate",
    },
    {
      name: "GitHub Copilot",
      icon: <Code className="w-5 h-5" />,
      level: "Intermediate",
    },
    {
      name: "Prompt Engineering",
      icon: <MessageSquare className="w-5 h-5" />,
      level: "Intermediate",
    },
  ];

  const frontendSkills = [
    {
      name: "JavaScript/ES6",
      icon: <Code className="w-5 h-5" />,
      level: "Expert",
    },
    { name: "React.js", icon: <Code className="w-5 h-5" />, level: "Expert" },
    {
      name: "Next.js",
      icon: <Briefcase className="w-5 h-5" />,
      level: "Advanced",
    },
    {
      name: "TypeScript",
      icon: <Code className="w-5 h-5" />,
      level: "Advanced",
    },
    {
      name: "Redux/Toolkit",
      icon: <Cpu className="w-5 h-5" />,
      level: "Advanced",
    },
    {
      name: "React Query",
      icon: <Cpu className="w-5 h-5" />,
      level: "Advanced",
    },
    { name: "CSS3/Sass", icon: <Code className="w-5 h-5" />, level: "Expert" },
    {
      name: "Bootstrap 4/5",
      icon: <Code className="w-5 h-5" />,
      level: "Expert",
    },
    {
      name: "Material UI",
      icon: <Briefcase className="w-5 h-5" />,
      level: "Advanced",
    },
    {
      name: "React Bootstrap",
      icon: <Briefcase className="w-5 h-5" />,
      level: "Advanced",
    },
    { name: "jQuery", icon: <Code className="w-5 h-5" />, level: "Advanced" },
  ];

  const backendSkills = [
    { name: "Node.js", icon: <Code className="w-5 h-5" />, level: "Advanced" },
    {
      name: "Express.js",
      icon: <Code className="w-5 h-5" />,
      level: "Advanced",
    },
    {
      name: "MongoDB/NoSQL",
      icon: <Cpu className="w-5 h-5" />,
      level: "Advanced",
    },
    { name: "REST API", icon: <Code className="w-5 h-5" />, level: "Advanced" },
    { name: "Git", icon: <Briefcase className="w-5 h-5" />, level: "Advanced" },
  ];

  // Handle scroll to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }

      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section
  const scrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed w-full bg-background border-b z-50">
        <div className="w-full max-w-screen-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <span className="bg-primary/10 text-primary p-2 rounded-lg">
              <Briefcase className="h-4 w-4" />
            </span>
            <span>Jick Lampago</span>
          </h1>
          <nav className="hidden md:flex items-center gap-6">
            {["home", "about", "projects", "skills", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className={`capitalize text-sm font-medium relative ${
                  activeSection === item
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
                {activeSection === item && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>
          <Button
            size="sm"
            onClick={() => scrollTo("contact")}
            className="ml-4"
          >
            Hire Me
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen pt-32 flex items-center bg-background"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-primary mt-0.5" />
                  FRONTEND DEVELOPER
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Building digital experiences that{" "}
                  <span className="text-primary">users love</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  I&apos;m Jick Lampago, a passionate frontend developer
                  specializing in React and Next.js applications. I transform
                  ideas into performant, accessible web experiences.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => scrollTo("projects")}>
                    View My Work
                  </Button>
                  <Button variant="outline" onClick={() => scrollTo("contact")}>
                    Contact Me
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-background to-muted border rounded-2xl p-1">
                    <Image
                      src="/pf.png"
                      alt="Profile"
                      width={320}
                      height={20}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="min-h-screen flex items-center px-4 bg-muted/50"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">About Me</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A detail-oriented developer who combines technical expertise
                with user-focused design
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Professional Journey
                </h3>
                <p className="text-muted-foreground mb-4">
                  With 5+ years in frontend development, I&apos;ve helped
                  startups and enterprises build products that users love. My
                  approach combines technical excellence with business
                  understanding.
                </p>
                <p className="text-muted-foreground">
                  Currently specializing in React ecosystems, I stay at the
                  forefront of web technologies while maintaining a strong
                  foundation in core web principles.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  Technical Approach
                </h3>
                <p className="text-muted-foreground mb-4">
                  I prioritize clean, maintainable code and believe in the power
                  of component-driven development. Performance and accessibility
                  are never afterthoughts in my workflow.
                </p>
                <p className="text-muted-foreground">
                  Beyond coding, I enjoy mentoring junior developers and
                  contributing to open source projects in my spare time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Selected work demonstrating my technical capabilities and
                problem-solving approach
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group bg-background/50 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-b from-black/5 to-background/90 backdrop-blur-md">
                      <Button
                        variant="secondary"
                        className="relative z-10 bg-white/90 hover:bg-white text-primary hover:text-primary/80 border-0 shadow-lg backdrop-blur-xl px-8 py-6 rounded-full font-medium transition-all duration-300 hover:scale-105"
                        onClick={() => (window.location.href = project.link)}
                      >
                        Explore Project
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-2xl font-medium tracking-tight group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground/80 line-clamp-2">
                      {project.description}
                    </CardDescription>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <p className="text-sm text-primary/80 font-medium">
                        {project.impact}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-medium text-primary/80 rounded-full transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Technical Skills</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The tools and technologies I use to bring ideas to life
              </p>
            </div>

            {/* AI & Development Tools */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                AI & Development Tools
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {aiToolsSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                      {skill.icon}
                    </div>
                    <h3 className="font-medium mb-1">{skill.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {skill.level}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Frontend Skills */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Frontend Development
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {frontendSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                      {skill.icon}
                    </div>
                    <h3 className="font-medium mb-1">{skill.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {skill.level}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Backend Development
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {backendSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                      {skill.icon}
                    </div>
                    <h3 className="font-medium mb-1">{skill.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {skill.level}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Let&apos;s Connect</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you have a project in mind or just want to chat tech,
                I&apos;d love to hear from you
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Get In Touch
                </h3>
                <p className="text-muted-foreground mb-6">
                  I&apos;m currently open to new opportunities and
                  collaborations. Reach out and let&apos;s discuss how I can
                  contribute to your team or project.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {config.recipientEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Viber: 09490390624
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={config.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={config.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={config.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formState.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message"
                        rows={5}
                        value={formState.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                    {formStatus.message && (
                      <div
                        className={`p-3 rounded-md text-sm ${
                          formStatus.type === "success"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {formStatus.message}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Jick Lampago. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
