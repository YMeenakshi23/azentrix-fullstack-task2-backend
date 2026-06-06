package com.azentrix.service;

import java.util.List;

import com.azentrix.dto.NoteRequest;
import com.azentrix.entity.Note;
import com.azentrix.entity.User;

public interface NoteService {

    Note createNote(NoteRequest request, User user);
    List<Note> getAllNotes(User user);
    Note updateNote(Long id, NoteRequest request, User user);
    void softDelete(Long id, User user);
    List<Note> getTrash(User user);
    void restoreNote(Long id, User user);
    List<Note> searchByTitle(String title, User user);
    List<Note> searchByTag(String tag, User user);
    void permanentDelete(Long id, User user);
}