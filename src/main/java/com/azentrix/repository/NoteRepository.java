package com.azentrix.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.azentrix.entity.Note;
import com.azentrix.entity.User;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserAndDeletedFalse(User user);
    Optional<Note> findByIdAndUser(Long id, User user);
    List<Note> findByUserAndDeletedTrue(User user);
    List<Note> findByUserAndTitleContainingIgnoreCaseAndDeletedFalse(
            User user,
            String title);
    List<Note> findByUserAndTagsContainingIgnoreCaseAndDeletedFalse(
            User user,
            String tag);

}