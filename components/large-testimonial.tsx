import Image from "next/image";
import TestimonialImg from "@/public/images/large-testimonial.jpg";
import NULogo from "@/public/images/Northeastern_Huskies.svg";

export default function LargeTestimonial() {
  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="space-y-3 text-center">
            <div className="relative inline-flex">
              <NULogo />
              <Image
                className="rounded-full"
                src={TestimonialImg}
                width={48}
                height={48}
                alt="Large testimonial"
              />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              “Avisari has been a game changer for our students. It's now easier than ever to{" "}
              <em className="italic text-gray-500">keep track of tasks</em>,
              it's become my go-to tool for everything.”
            </p>
            <div className="text-sm font-medium text-gray-500">
              <span className="text-gray-700">Mary Sullivan</span>{" "}
              <span className="text-gray-400">/</span>{" "}
              <a className="text-blue-500" href="#0">
                Advisor at Northeastern University
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
