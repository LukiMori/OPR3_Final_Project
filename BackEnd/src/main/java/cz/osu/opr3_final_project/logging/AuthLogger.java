package cz.osu.opr3_final_project.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuthLogger {

    private static final Logger logger = LoggerFactory.getLogger(AuthLogger.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public void logRegistration(Long userId, String username, String plainPassword, String hashedPassword) {
        String timestamp = LocalDateTime.now().format(formatter);

        String consoleMessage = String.format(
                "[REGISTRATION] User: %s (ID: %d) | Plain Password: %s | Time: %s",
                username, userId, plainPassword, timestamp
        );
        System.out.println(consoleMessage);

        String fileMessage = String.format(
                "[REGISTRATION] User: %s (ID: %d) | Hashed Password: %s | Time: %s",
                username, userId, hashedPassword, timestamp
        );
        logger.info(fileMessage);
    }


    public void logLogin(Long userId, String username, String plainPassword, String hashedPassword, boolean success) {
        String timestamp = LocalDateTime.now().format(formatter);
        String status = success ? "SUCCESS" : "FAILED";

        String consoleMessage = String.format(
                "[LOGIN_%s] User: %s (ID: %s) | Plain Password: %s | Time: %s",
                status, username, userId != null ? userId : "N/A", plainPassword, timestamp
        );
        System.out.println(consoleMessage);

        String fileMessage = String.format(
                "[LOGIN_%s] User: %s (ID: %s) | Hashed Password: %s | Time: %s",
                status, username, userId != null ? userId : "N/A",
                hashedPassword != null ? hashedPassword : "N/A", timestamp
        );
        logger.info(fileMessage);
    }


    public void logFailedLoginUserNotFound(String username, String plainPassword) {
        String timestamp = LocalDateTime.now().format(formatter);

        String consoleMessage = String.format(
                "[LOGIN_FAILED] User: %s (NOT_FOUND) | Plain Password: %s | Time: %s",
                username, plainPassword, timestamp
        );
        System.out.println(consoleMessage);

        String fileMessage = String.format(
                "[LOGIN_FAILED] User: %s (NOT_FOUND) | Time: %s",
                username, timestamp
        );
        logger.info(fileMessage);
    }
}