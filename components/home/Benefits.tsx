import React from "react";

const Benefits: React.FC = () => {
  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-14">
        <div className="flex flex-col items-center justify-center text-center gap-5">
          <h1 className="text-5xl">
            Unique Advantages of{" "}
            <span
              className=" bg-gradient-to-r
              from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
              to-[var(--green-gradient-to)]
              bg-clip-text
              text-transparent"
            >
              Polymers Hub
            </span>
          </h1>
          <p className="text-[var(--text-gray-tertiary)] font-normal text-lg text-center max-w-2xl">
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.{" "}
          </p>
        </div>
      </div>
      <h2>Benefits</h2>
      <ul>
        <li>Benefit 1</li>
        <li>Benefit 2</li>
        <li>Benefit 3</li>
      </ul>
    </section>
  );
};

export default Benefits;
