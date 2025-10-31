"use client";

export default function Features() {
  const features = [
    {
      icon: "🎵",
      title: "AI-Powered Generation",
      description:
        "Describe any mood, genre, or theme and let AI create the perfect playlist for you.",
    },
    {
      icon: "🔗",
      title: "Direct Spotify Integration",
      description: "Playlists are created directly in your Spotify account with one click.",
    },
    {
      icon: "⚡",
      title: "Instant Creation",
      description: "Get 10 curated songs in seconds, ready to listen and enjoy.",
    },
    {
      icon: "🎯",
      title: "Personalized Results",
      description: "AI learns your preferences and creates playlists tailored to your taste.",
    },
  ];

  return (
    <section id="features" className="bg-card/50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Why Choose Museify?</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Experience the future of playlist creation with AI-powered curation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-border group rounded-xl border p-6 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/5"
            >
              <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
