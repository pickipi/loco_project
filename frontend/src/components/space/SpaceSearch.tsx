import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SpaceSearch() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    time: "",
    capacity: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryString = new URLSearchParams(searchParams).toString();
    router.push(`/spaces/search?${queryString}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white shadow-lg rounded-lg p-6">
      <div className="grid grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="지역 검색"
          className="border rounded-md p-2"
          value={searchParams.location}
          onChange={(e) =>
            setSearchParams({ ...searchParams, location: e.target.value })
          }
        />
        <input
          type="date"
          className="border rounded-md p-2"
          value={searchParams.date}
          onChange={(e) =>
            setSearchParams({ ...searchParams, date: e.target.value })
          }
        />
        <input
          type="time"
          className="border rounded-md p-2"
          value={searchParams.time}
          onChange={(e) =>
            setSearchParams({ ...searchParams, time: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="인원"
          className="border rounded-md p-2"
          value={searchParams.capacity}
          onChange={(e) =>
            setSearchParams({ ...searchParams, capacity: e.target.value })
          }
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        공간 검색하기
      </button>
    </form>
  );
}
