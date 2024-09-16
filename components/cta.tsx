import Image from "next/image";

export default function Cta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center bg-gray-50 shadow-lg"
          data-aos="zoom-y-out"
        >
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:mb-12 md:text-4xl">
              Integrate Avisari with your University
            </h2>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <a
                className="btn group mb-4 w-full bg-gray-800 text-white shadow hover:bg-gray-700 sm:mb-0 sm:w-auto"
                href="#0"
              >
                <span className="relative inline-flex items-center">
                  Contact Us{" "}
                  <span className="ml-1 tracking-normal text-gray-300 transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
