package cz.osu.opr3_final_project.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ActivityLogger {

    private static final Logger logger = LoggerFactory.getLogger(ActivityLogger.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    public void logMovieLike(Long userId, String username, Long movieId, String movieTitle, boolean isLiked) {
        String timestamp = LocalDateTime.now().format(formatter);
        String action = isLiked ? "LIKED" : "UNLIKED";

        String logMessage = String.format(
                "[MOVIE_%s] User: %s (ID: %d) | Movie: %s (ID: %d) | Time: %s",
                action, username, userId, movieTitle, movieId, timestamp
        );

        logger.info(logMessage);
    }

    public void logComment(Long userId, String username, Long movieId, String movieTitle, String commentContent) {
        String timestamp = LocalDateTime.now().format(formatter);

        String logMessage = String.format(
                "[COMMENT_ADDED] User: %s (ID: %d) | Movie: %s (ID: %d) | Comment: \"%s\" | Time: %s",
                username, userId, movieTitle, movieId, commentContent, timestamp
        );

        logger.info(logMessage);
    }

    public void logCommentDeletion(Long userId, String username, Long commentId, String movieTitle) {
        String timestamp = LocalDateTime.now().format(formatter);

        String logMessage = String.format(
                "[COMMENT_DELETED] User: %s (ID: %d) | Comment ID: %d | Movie: %s | Time: %s",
                username, userId, commentId, movieTitle, timestamp
        );

        logger.info(logMessage);
    }
}