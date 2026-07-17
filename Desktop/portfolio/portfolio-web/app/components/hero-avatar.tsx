import Image from "next/image";

type HeroAvatarProps = {
  avatar: { src: string; alt: string };
};

export function HeroAvatar({ avatar }: HeroAvatarProps) {
  return (
    <div className="col-span-1 md:col-span-7 flex justify-center items-center relative mt-6 md:mt-0" style={{ minHeight: "280px" }}>
      <div className="relative animate-float w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[619px] md:h-[619px]" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
        <Image
          src={avatar.src}
          alt={avatar.alt}
          width={840}
          height={840}
          priority
          className="md:translate-x-[10%] md:-translate-y-[10%]"
          style={{
            objectFit: "contain",
            filter: "drop-shadow(0 24px 48px rgba(204,108,92,0.35)) drop-shadow(0 0 80px rgba(26,89,255,0.20))",
          }}
        />
      </div>
    </div>
  );
}
