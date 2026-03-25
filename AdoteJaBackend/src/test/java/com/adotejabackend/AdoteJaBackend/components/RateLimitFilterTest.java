package com.adotejabackend.AdoteJaBackend.components;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class RateLimitFilterTest {

    private RateLimitFilter filter;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private FilterChain chain;

    @BeforeEach
    void setUp() {
        filter = new RateLimitFilter();
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        chain = mock(FilterChain.class);
    }

    @Test
    void nonLoginRequest_passesThrough() throws Exception {
        when(request.getMethod()).thenReturn("GET");
        when(request.getRequestURI()).thenReturn("/pets");

        filter.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(response, never()).setStatus(429);
    }

    @Test
    void loginRequest_underLimit_passesThrough() throws Exception {
        when(request.getMethod()).thenReturn("POST");
        when(request.getRequestURI()).thenReturn("/users/login");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        filter.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
    }

    @Test
    void loginRequest_exceedsLimit_returns429() throws Exception {
        when(request.getMethod()).thenReturn("POST");
        when(request.getRequestURI()).thenReturn("/users/login");
        when(request.getRemoteAddr()).thenReturn("10.0.0.1");

        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        when(response.getWriter()).thenReturn(pw);

        // first 5 should pass
        for (int i = 0; i < 5; i++) {
            filter.doFilterInternal(request, response, chain);
        }
        verify(chain, times(5)).doFilter(request, response);

        // 6th should be blocked
        filter.doFilterInternal(request, response, chain);

        verify(response).setStatus(429);
        verify(chain, times(5)).doFilter(request, response); // still only 5
    }

    @Test
    void differentIps_trackedSeparately() throws Exception {
        HttpServletRequest request2 = mock(HttpServletRequest.class);
        when(request.getMethod()).thenReturn("POST");
        when(request.getRequestURI()).thenReturn("/users/login");
        when(request.getRemoteAddr()).thenReturn("10.0.0.2");

        when(request2.getMethod()).thenReturn("POST");
        when(request2.getRequestURI()).thenReturn("/users/login");
        when(request2.getRemoteAddr()).thenReturn("10.0.0.3");

        // 5 attempts from IP1
        for (int i = 0; i < 5; i++) {
            filter.doFilterInternal(request, response, chain);
        }

        // IP2 should still pass
        filter.doFilterInternal(request2, response, chain);
        verify(chain, times(6)).doFilter(any(), eq(response));
    }
}
