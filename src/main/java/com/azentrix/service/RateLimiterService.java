package com.azentrix.service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;

@Service
public class RateLimiterService {

    private final Map<String, Bucket> buckets =
            new ConcurrentHashMap<>();

    private Bucket createBucket() {

        Bandwidth limit =
                Bandwidth.classic(
                        30,
                        Refill.greedy(
                                30,
                                Duration.ofMinutes(1)));

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public boolean allowRequest(String userEmail) {

        Bucket bucket =
                buckets.computeIfAbsent(
                        userEmail,
                        k -> createBucket());

        return bucket.tryConsume(1);
    }
}