package com.booking.backend.repository;

import com.booking.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PostRepository extends JpaRepository<Post, Long> {


}