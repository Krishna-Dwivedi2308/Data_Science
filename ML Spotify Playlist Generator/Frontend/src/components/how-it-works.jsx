"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect Spotify",
      description: "Sign in with your Spotify account securely",
    },
    {
      number: "2",
      title: "Describe Your Vibe",
      description: "Tell us what kind of playlist you want to create",
    },
    {
      number: "3",
      title: "AI Creates Magic",
      description: "Our AI generates 10 perfect songs for your mood",
    },
    {
      number: "4",
      title: "Enjoy Your Playlist",
      description: "Listen directly on Spotify or save for later",
    },
  ];

  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">How It Works</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Four simple steps to your perfect playlist
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-green-500/50 to-transparent md:block"></div>
              )}

              <div className="relative z-10">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                  <span className="text-3xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="mb-2 text-center text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
