// app/users/[id]/page.tsx

type UserPageProps = {
    params: {
      id: string;
    };
  };
  
  export default function UserPage({ params }: UserPageProps) {
    // URL から来た [id] の値がここに入る
    const userId = params.id;
  
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">ユーザーページ（動的ルート）</h1>
  
          <p>このページは動的ルートから表示されています。</p>
  
          <p className="text-lg font-mono">
            URL の [id] : <span className="font-bold">{userId}</span>
          </p>
  
          <p className="text-sm text-gray-500">
            例）/users/123 にアクセスすると id = "123" が表示される
          </p>
        </div>
      </main>
    );
  }
  