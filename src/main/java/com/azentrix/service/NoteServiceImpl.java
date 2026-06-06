package com.azentrix.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.azentrix.dto.NoteRequest;
import com.azentrix.entity.Note;
import com.azentrix.entity.User;
import com.azentrix.repository.NoteRepository;

@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Override
    public Note createNote(NoteRequest request, User user) {

        Note note = new Note();

        note.setTitle(request.getTitle());
        note.setBody(request.getBody());
        note.setTags(request.getTags());

        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        note.setUser(user);

        return noteRepository.save(note);
    }

    @Override
    public List<Note> getAllNotes(User user) {
        return noteRepository.findByUserAndDeletedFalse(user);
    }
    @Override
    public Note updateNote(Long id,
                           NoteRequest request,
                           User user) {

        Note note =
                noteRepository
                .findByIdAndUser(id, user)
                .orElse(null);

        if (note == null || note.isDeleted()) {
            return null;
        }

        note.setTitle(request.getTitle());
        note.setBody(request.getBody());
        note.setTags(request.getTags());
        note.setUpdatedAt(LocalDateTime.now());

        return noteRepository.save(note);
    }
    @Override
    public void softDelete(Long id, User user) {

        Note note =
                noteRepository
                .findByIdAndUser(id, user)
                .orElse(null);

        if (note != null) {

            note.setDeleted(true);

            noteRepository.save(note);
        }
    }
    @Override
    public List<Note> getTrash(User user) {
        return noteRepository.findByUserAndDeletedTrue(user);
    }
    @Override
    public void restoreNote(Long id, User user) {

        Note note =
                noteRepository
                .findByIdAndUser(id, user)
                .orElse(null);

        if (note != null) {

            note.setDeleted(false);

            noteRepository.save(note);
        }
    }
    @Override
    public List<Note> searchByTitle(
            String title,
            User user) {

        return noteRepository
                .findByUserAndTitleContainingIgnoreCaseAndDeletedFalse(
                        user,
                        title);
    }
    @Override
    public List<Note> searchByTag(
            String tag,
            User user) {

        return noteRepository
                .findByUserAndTagsContainingIgnoreCaseAndDeletedFalse(
                        user,
                        tag);
    }
    @Override
    public void permanentDelete(Long id, User user) {

        Note note =
                noteRepository
                .findByIdAndUser(id, user)
                .orElse(null);

        if (note != null) {
            noteRepository.delete(note);
        }
    }
}