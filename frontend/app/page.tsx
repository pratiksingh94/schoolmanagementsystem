"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  Calendar,
  ChartBar,
  BookOpen,
  Shield,
  MessageSquare,
  BarChart,
  CheckCircle2,
  Menu,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setIsAdmin(data.name === "admin");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem("token");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
        className: "bg-blue-500",
      });
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full bg-background/80 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold text-xl">Schooool</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">
                Testimonials
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              {isClient && localStorage.getItem("token") ? (
                <div className="flex items-center space-x-4">
                  {isAdmin ? (
                    <Link href="/dashboard">
                      <Button>Dashboard</Button>
                    </Link>
                  ) : (
                    <Link href="/user-dashboard">
                      <Button>My Account</Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* HEROOOOOOOOO */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Transform Your School Management with our software
            </motion.h1>
            <motion.p
              className="text-xl mb-8 max-w-2xl text-primary-foreground/90"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur facilisis,
              sapien id efficitur gravida, lorem velit bibendum elit.
            </motion.p>
            <motion.div
              className="space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Button size="lg" variant="secondary" asChild>
                <Link href="/pricing">Get Started</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="#contact">Book Demo</Link>
              </Button>
            </motion.div>
            <motion.div
              className="mt-12 grid grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-primary-foreground/80">Schools</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-primary-foreground/80">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500%</div>
                <div className="text-primary-foreground/80">satisfaction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Modern Education</h2>
            <p className="text-lg text-muted-foreground">
              lorem ipsum dolor st amet consectetur
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Lorem Ipsum"
              description="Dolor sit amet, consectetur adipiscing elit. Integer nec odio."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Sed Ut Perspiciatis"
              description="Unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="Nemo Enim"
              description="Ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Ut Enim Ad Minim"
              description="Veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="Duis Aute Irure"
              description="Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            />
            <FeatureCard
              icon={<BarChart className="h-10 w-10" />}
              title="Excepteur Sint"
              description="Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
            />
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Trusted by Leading Institutions
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-background p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-7">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              lorem ipsum dolor sit amet
            </motion.p>
          </div>
          <motion.div
            className="flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Button size="lg" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6" />
                <span className="font-bold text-xl">School</span>
              </div>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                eget lacus in.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="#testimonials">Testimonials</Link>
                </li>
                <li>
                  <Link href="#faq">FAQ</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/">Something</Link>
                </li>
                <li>
                  <Link href="/">Something else</Link>
                </li>
                <li>
                  <Link href="/">Something again</Link>
                </li>
                <li>
                  <Link href="/">XYZ</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} School. all rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

const testimonials = [
  {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    name: "Lorem Ipsum",
    role: "principal, Lorem High School",
  },
  {
    content:
      "Suspendisse potenti. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.",
    name: "Dolor Sit",
    role: "acadmic director, Ipsum Academy",
  },
  {
    content:
      "Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna.",
    name: "Amet Consectetur",
    role: "IT Admin, Dolor College",
  },
];

const faqs = [
  {
    question: "Lorem ipsum dolor sit amet?",
    answer:
      "Consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  },
  {
    question: "Sed nisi nulla facilisi?",
    answer:
      "Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.",
  },
  {
    question: "Curabitur tortor pellentesque?",
    answer:
      "Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec.",
  },
  {
    question: "Etiam ultricies nisi vel augue?",
    answer:
      "Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.",
  },
  {
    question: "Maecenas malesuada elit lectus?",
    answer:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
  },
  {
    question: "Donec vitae sapien ut libero venenatis?",
    answer:
      "Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.",
  },
];
