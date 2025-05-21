import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  width?: number;
  height?: number;
  className?: string;
  colorScheme?: 'light' | 'dark';
}

export default function Logo({ href = '/', width = 100, height = 30, className, colorScheme = 'dark' }: LogoProps) {
  const imgSrc = colorScheme === 'light' ? '/logo-light.png' : '/logo.png';

  return (
    <Link href={href} className={className}>
      <Image
        src={imgSrc}
        alt="LoCo Logo"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
} 