package com.booking.backend.controller;

import com.booking.backend.entity.Post;
import com.booking.backend.service.PostService;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final Cloudinary cloudinary;

    // =========================
    // PUBLIC
    // =========================

    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/posts/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    // =========================
    // ADMIN CREATE
    // =========================

    @PostMapping("/admin/posts")
    public Post createPost(

            @RequestPart("title") String title,

            @RequestPart("slug") String slug,

            @RequestPart("content") String content,

            @RequestPart(value = "file", required = false) MultipartFile file

    ) {

        Post post = new Post();

        post.setTitle(title);
        post.setSlug(slug);
        post.setContent(content);

        String imageUrl = uploadToCloudinary(file);

        post.setThumbnail(imageUrl);

        return postService.createPost(post);
    }

    // =========================
    // ADMIN UPDATE
    // =========================

    @PutMapping("/admin/posts/{id}")
    public Post updatePost(

            @PathVariable Long id,

            @RequestPart("title") String title,

            @RequestPart("slug") String slug,

            @RequestPart("content") String content,

            @RequestPart(value = "file", required = false) MultipartFile file

    ) {

        Post post = postService.getPostById(id);

        post.setTitle(title);
        post.setSlug(slug);
        post.setContent(content);

        if (file != null && !file.isEmpty()) {

            String imageUrl = uploadToCloudinary(file);

            post.setThumbnail(imageUrl);
        }

        return postService.updatePost(id, post);
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/admin/posts/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    // =========================
    // CLOUDINARY
    // =========================

    private String uploadToCloudinary(
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder",
                            "posts"));

            return uploadResult
                    .get("secure_url")
                    .toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Upload Cloudinary lỗi: "
                            + e.getMessage());
        }
    }
}