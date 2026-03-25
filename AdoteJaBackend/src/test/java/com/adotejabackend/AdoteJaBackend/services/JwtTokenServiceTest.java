package com.adotejabackend.AdoteJaBackend.services;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenServiceTest {

    @Test
    void validateSecret_blankSecret_lancaIllegalStateException() {
        JwtTokenService service = new JwtTokenService();
        ReflectionTestUtils.setField(service, "secretKey", "");
        ReflectionTestUtils.setField(service, "issuer", "test");

        assertThatThrownBy(service::validateSecret)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("JWT secret");
    }

    @Test
    void validateSecret_nullSecret_lancaIllegalStateException() {
        JwtTokenService service = new JwtTokenService();
        ReflectionTestUtils.setField(service, "secretKey", null);
        ReflectionTestUtils.setField(service, "issuer", "test");

        assertThatThrownBy(service::validateSecret)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("JWT secret");
    }

    @Test
    void validateSecret_validSecret_naoLancaExcecao() {
        JwtTokenService service = new JwtTokenService();
        ReflectionTestUtils.setField(service, "secretKey", "minha-secret-valida");
        ReflectionTestUtils.setField(service, "issuer", "test");

        service.validateSecret(); // should not throw
    }
}
