package com.azentrix.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.azentrix.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}