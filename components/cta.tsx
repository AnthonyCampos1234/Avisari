import Image from "next/image";

export default function Cta() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center bg-gray-50 shadow-lg"
          data-aos="zoom-y-out"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-opacity-50 bg-gradient-to-br from-gray-100 to-gray-200" aria-hidden="true"></div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-gray-200 opacity-30"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-20 w-20 rounded-full bg-gray-200 opacity-30"></div>

          <div className="relative px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:mb-12 md:text-4xl">
              Integrate Avisari with your University
            </h2>
            <p className="mb-8 text-lg text-gray-600">Enhance your institution's capabilities with our cutting-edge solutions</p>
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

      {/* Decorative blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" aria-hidden="true"></div>
      <div className="absolute top-1/2 right-0 translate-y-1/2 translate-x-1/2 w-64 h-64 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20" aria-hidden="true"></div>
    </section>
  );
}
