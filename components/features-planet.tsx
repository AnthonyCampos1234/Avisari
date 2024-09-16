import Image from "next/image";
import Boston_University_wordmark from "@/public/images/Boston_University_wordmark.svg";
import Harvard_University_logo from "@/public/images/Harvard University logo.svg";
import MIT_logo from "@/public/images/MIT_logo.svg";
import Northeastern_Huskies from "@/public/images/Northeastern_Huskies.svg";

export default function FeaturesPlanet() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Nota Solutions empowers universities to enhance student success
            </h2>
          </div>
          {/* Trusted by universities */}
          <div className="pb-16 md:pb-20" data-aos="fade-up">
            <div className="text-center">
              <h3 className="mb-8 text-2xl font-semibold text-gray-700">Trusted by leading universities</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <Image src={Northeastern_Huskies} width={120} height={40} alt="Northeastern University" className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
                <Image src={Boston_University_wordmark} width={120} height={40} alt="Boston University" className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
                <Image src={Harvard_University_logo} width={120} height={40} alt="Harvard University" className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
                <Image src={MIT_logo} width={120} height={40} alt="MIT" className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
          {/* Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<SchoolIcon color="#4ffbb4" />}
              title="Student Success"
              description="Empower students with personalized learning experiences and comprehensive support systems."
            />
            <FeatureCard
              icon={<AnalyticsIcon color="#f14771" />}
              title="Data-Driven Insights"
              description="Leverage advanced analytics to make informed decisions and improve educational outcomes."
            />
            <FeatureCard
              icon={<CollaborationIcon color="#23bbe9" />}
              title="Seamless Collaboration"
              description="Foster communication between students, faculty, and staff with intuitive collaboration tools."
            />
            <FeatureCard
              icon={<CustomizationIcon color="#4ffbb4" />}
              title="Tailored Solutions"
              description="Adapt our platform to meet the unique needs of your institution with customizable features."
            />
            <FeatureCard
              icon={<SecurityIcon color="#f14771" />}
              title="Enhanced Security"
              description="Protect sensitive data with state-of-the-art security measures and compliance standards."
            />
            <FeatureCard
              icon={<SupportIcon color="#23bbe9" />}
              title="24/7 Support"
              description="Access round-the-clock assistance to ensure smooth operations and quick issue resolution."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <article className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-medium text-gray-800">{title}</h3>
      <p className="text-[15px] text-gray-600">{description}</p>
    </article>
  );
}

// Update the icon components to accept a color prop
function SchoolIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function AnalyticsIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function CollaborationIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CustomizationIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SecurityIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SupportIcon({ color = "currentColor" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}