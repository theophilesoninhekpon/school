import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <aside className=" bg-blue-700 text-white dark:bg-gray-900">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold">MySchool</h2>
        </div>
        <nav>
          <ul>
            <li className="p-4 hover:bg-blue-600 dark:hover:bg-gray-700">
              <Link href="/classes" className="w'full">Classes</Link>
            </li>
            <li className="p-4 hover:bg-blue-600 dark:hover:bg-gray-700">
              <Link href="/professeurs">Professeurs</Link>
            </li>
            <li className="p-4 hover:bg-blue-600 dark:hover:bg-gray-700">
              <Link href="/eleves">Élèves</Link>
            </li>
            <li className="p-4 hover:bg-blue-600 dark:hover:bg-gray-700">
              <Link href="/settings">Paramètres</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-800 dark:text-white">
        {children}
      </main>
    </div>
  );
}
