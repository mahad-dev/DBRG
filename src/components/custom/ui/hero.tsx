import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "react-router-dom";

interface HeroProps {
  image: string;
  title: string;
  description: string;
} 
export default function Hero({ image, title, description }: HeroProps) {
  const location = useLocation();

  const bgTransparentPages = ["/about"];
  const goldenTitlePages = ["/"];
  const bgTransparent = bgTransparentPages.includes(location.pathname);
  const goldenTitle = goldenTitlePages.includes(location.pathname);

  return (
    <section
      className="relative w-full flex items-center justify-center"
      style={{
        backgroundImage: `url('${image}')`,
        width: "100%",
        height: "705px", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 1,
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          !bgTransparent ? "bg-black/80" : "bg-transparent"
        }`}
      />

      {/* Content Card */}
      <Card className="relative bg-transparent border-none shadow-none flex items-center justify-center h-full">
        <CardContent className="text-center px-4 sm:px-6 md:px-0">
          {/* Title */}
          <h1
            className="mx-auto text-[32px] sm:text-[42px] md:text-[52px] leading-snug sm:leading-snug md:leading-[100%]"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              fontStyle: "normal",
              width: "100%",
              maxWidth: "920px",
              height: "auto",
              textAlign: "center",
              color: goldenTitle ? "#C6A95F" : "#FFFFFF",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className="mx-auto mt-10 text-[16px] sm:text-[20px] md:text-[24px] leading-snug sm:leading-snug md:leading-[100%]"
            style={{
              fontFamily: "Gilroy-Medium, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              width: "100%",
              maxWidth: "917px",
              height: "auto",
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {description}
          </p>
        </CardContent>
      </Card>

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 sm:h-2 md:h-2.5"
        style={{
          background: "linear-gradient(90deg, #121212, #C6A95F, #121212)",
        }}
      />
    </section>
  );
}
