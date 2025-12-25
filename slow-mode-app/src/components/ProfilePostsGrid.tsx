"use client";

type Post = {
    id: number;
    photo_resultat?: string | null;
};

interface Props {
    posts: Post[];
}

export default function ProfilePostsGrid({ posts }: Props) {
    if (!posts.length) {
        return (
            <p className="text-center text-sm text-gray-500">
                Aucun post publié pour le moment.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-[2px]">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="aspect-square bg-gray-100 overflow-hidden"
                >
                    {post.photo_resultat ? (
                        <img
                            src={post.photo_resultat}
                            alt="Post"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            Aucun visuel
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
