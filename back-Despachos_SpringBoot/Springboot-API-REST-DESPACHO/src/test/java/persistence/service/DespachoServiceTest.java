package persistence.service;

import com.citt.exceptions.DespachoNotFoundException;
import com.citt.persistence.entity.Despacho;
import com.citt.persistence.repository.DespachoRepository;
import com.citt.persistence.services.DespachoServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DespachoServiceTest {

    @Mock
    private DespachoRepository despachoRepository;

    @InjectMocks
    private DespachoServiceImpl despachoService;

    private Despacho despacho;

    @BeforeEach
    void setUp() {
        // Inicializamos un objeto Despacho para usar en las pruebas
        despacho = new Despacho();
        despacho.setIdDespacho(1L);
        despacho.setDireccionCompra("Av. Siempre Viva 742");
        despacho.setPatenteCamion("ABCD-12");
        despacho.setDespachado(false);
    }

    @Test
    @DisplayName("Debe guardar un despacho correctamente")
    void testSaveDespacho() {
        when(despachoRepository.save(any(Despacho.class))).thenReturn(despacho);
        
        Despacho saved = despachoService.saveDespacho(new Despacho());
        
        assertNotNull(saved);
        assertEquals("ABCD-12", saved.getPatenteCamion());
        verify(despachoRepository).save(any(Despacho.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción si el despacho no existe al buscar por ID")
    void testFindById_NotFound() {
        when(despachoRepository.findById(99L)).thenReturn(Optional.empty());
        
        assertThrows(DespachoNotFoundException.class, () -> despachoService.findById(99L));
    }

    @Test
    @DisplayName("Debe actualizar todos los campos de un despacho existente")
    void testUpdateDespacho_Success() throws DespachoNotFoundException {
        Despacho nuevosDatos = new Despacho();
        nuevosDatos.setPatenteCamion("EFGH-34");
        nuevosDatos.setDespachado(true);

        when(despachoRepository.findById(1L)).thenReturn(Optional.of(despacho));
        when(despachoRepository.save(any(Despacho.class))).thenReturn(despacho);

        Despacho actualizado = despachoService.updateDespacho(1L, nuevosDatos);

        assertEquals("EFGH-34", actualizado.getPatenteCamion());
        assertTrue(actualizado.isDespachado());
        verify(despachoRepository).save(despacho);
    }
}