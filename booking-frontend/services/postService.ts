import api from "@/lib/api";

// =========================
// TYPE
// =========================

export interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  createdAt: string;
}

// =========================
// GET ALL POSTS
// =========================

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get("/posts");

  return Array.isArray(response.data)
    ? response.data
    : [];
};

// =========================
// GET POST BY ID
// =========================

export const getPostById = async (
  id: number | string,
): Promise<Post> => {
  const response = await api.get(
    `/posts/${id}`,
  );

  return response.data;
};

// =========================
// CREATE POST
// =========================

export const createPost = async (
  file: File | null,
  title: string,
  slug: string,
  content: string,
): Promise<Post> => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  formData.append("title", title);
  formData.append("slug", slug);
  formData.append("content", content);

  const response = await api.post(
    "/admin/posts",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =========================
// UPDATE POST
// =========================

export const updatePost = async (
  id: number | string,
  data: {
    file?: File | null;
    title: string;
    slug: string;
    content: string;
  },
): Promise<Post> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("content", data.content);

  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await api.put(
    `/admin/posts/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return response.data;
};

// =========================
// DELETE POST
// =========================

export const deletePost = async (
  id: number | string,
): Promise<void> => {
  await api.delete(`/admin/posts/${id}`);
};