package com.azentrix.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.azentrix.dto.NoteRequest;
import com.azentrix.entity.Note;
import com.azentrix.entity.User;
import com.azentrix.security.JwtUtil;
import com.azentrix.service.NoteService;
import com.azentrix.service.UserService;

@RestController
@RequestMapping("/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserService userService;

    private User getUserFromToken(String authHeader) {

        String token =
                authHeader.replace("Bearer ", "");

        String email =
                JwtUtil.extractEmail(token);

        return userService.findByEmail(email);
    }

    @PostMapping
    public Note createNote(
            @RequestBody NoteRequest request,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        return noteService.createNote(request, user);
    }

    @GetMapping
    public Object getAllNotes(
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        return noteService.getAllNotes(user);
    }
    @PutMapping("/{id}")
    public Object updateNote(
            @PathVariable Long id,
            @RequestBody NoteRequest request,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        Note note =
                noteService.updateNote(id, request, user);

        if (note == null) {
            return "Note not found or already deleted";
        }

        return note;
    }
    @DeleteMapping("/{id}")
    public String deleteNote(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        noteService.softDelete(id, user);

        return "Note moved to trash";
    }

    @GetMapping("/trash")
    public Object getTrash(
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        return noteService.getTrash(user);
    }

    @PutMapping("/restore/{id}")
    public String restoreNote(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        noteService.restoreNote(id, user);

        return "Note restored successfully";
    }

    @GetMapping("/search/title")
    public Object searchByTitle(
            @RequestParam String title,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        return noteService.searchByTitle(title, user);
    }

    @GetMapping("/search/tag")
    public Object searchByTag(
            @RequestParam String tag,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        return noteService.searchByTag(tag, user);
    }

    @DeleteMapping("/permanent/{id}")
    public String permanentDelete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        noteService.permanentDelete(id, user);

        return "Note permanently deleted";
    }
}