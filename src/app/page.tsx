import Image from "next/image";
import Link from "next/link";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          LoCo - Location + Connect
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          당신의 공간을 공유하고, 새로운 연결을 만들어보세요
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/spaces" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600">
            공간 찾기
          </Link>
          <Link href="/register" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
            공간 등록하기
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">주요 서비스</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">공간 공유</h3>
            <p className="text-gray-600 dark:text-gray-300">사용하지 않는 공간을 수익화하고 새로운 가치를 만들어보세요.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">맞춤 매칭</h3>
            <p className="text-gray-600 dark:text-gray-300">당신의 필요에 맞는 완벽한 공간을 찾아보세요.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">안전한 거래</h3>
            <p className="text-gray-600 dark:text-gray-300">검증된 사용자와 안전하게 거래하세요.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="mb-8">LoCo와 함께 새로운 공간 경험을 시작해보세요.</p>
          <Link href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700">
            무료로 시작하기
          </Link>
        </div>
      </section>
    </main>
  );
}
