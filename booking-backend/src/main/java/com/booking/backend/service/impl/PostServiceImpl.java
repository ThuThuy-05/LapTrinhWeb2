package com.booking.backend.service.impl;

import com.booking.backend.entity.Post;
import com.booking.backend.repository.PostRepository;
import com.booking.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));
    }

    @Override
    public Post createPost(Post post) {

        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Long id, Post data) {

        Post post = getPostById(id);

        post.setTitle(data.getTitle());
        post.setSlug(data.getSlug());
        post.setThumbnail(data.getThumbnail());
        post.setContent(data.getContent());

        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}