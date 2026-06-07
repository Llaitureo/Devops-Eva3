package persistence.service;

import com.citt.exceptions.VentaNotFoundException;
import com.citt.persistence.entity.Venta;
import com.citt.persistence.repository.VentaRepository;
import com.citt.persistence.services.VentaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class VentaServiceTest {

    @Mock
    private VentaRepository ventaRepository;

    @InjectMocks
    private VentaServiceImpl ventaService;

    private Venta venta;

    @BeforeEach
    public void setUp(){
        venta = Venta.builder()
                .direccionCompra("Calle Falsa 123")
                .valorCompra(1000)
                .fechaCompra(LocalDate.of(2025,4,14))
                .despachoGenerado(false)
                .build();
    }

    @Test
    @DisplayName("Cuando se guarda una venta válida, entonces se persiste correctamente")
    public void whenSavingValidVenta_thenItIsPersistedCorrectly(){
        //Prepara la simulación
        when(ventaRepository.save(any(Venta.class))).thenReturn(venta);

        //Llama al servicio
        Venta savedVenta = ventaService.saveVenta(venta);

        //Verifica el resultado
        verify(ventaRepository, times(1)).save(venta);

        //Verifica que la venta guardada es la misma que la venta original
        assertNotNull(savedVenta);
        assertEquals(venta.getDireccionCompra(), savedVenta.getDireccionCompra());
        assertEquals(venta.getValorCompra(), savedVenta.getValorCompra());
        assertEquals(venta.getFechaCompra(), savedVenta.getFechaCompra());
        assertEquals(venta.getDespachoGenerado(), savedVenta.getDespachoGenerado());
    }

    @Test
    @DisplayName("Cuando se guarda una venta, entonces se asigna un ID")
    public void whenVentaIsSavedthenIdIsAssigned(){
        // Preparar
        Venta ventaToSave = Venta.builder()
                .direccionCompra("Calle Falsa 123")
                .valorCompra(1000)
                .fechaCompra(LocalDate.of(2025,4,14))
                .despachoGenerado(false)
                .build();

        Venta ventaWithId = Venta.builder()
                .idVenta(1L)
                .direccionCompra("Calle Falsa 123")
                .valorCompra(1000)
                .fechaCompra(LocalDate.of(2025,4,14))
                .despachoGenerado(false)
                .build();

        when(ventaRepository.save(any(Venta.class))).thenReturn(ventaWithId);

        // Ejecutar
        Venta result = ventaService.saveVenta(ventaToSave);

        // Verificar
        verify(ventaRepository).save(ventaToSave);
        assertNotNull(result);
        assertEquals(1L, result.getIdVenta());
        assertEquals(ventaToSave.getDireccionCompra(), result.getDireccionCompra());
    }

    @Test
    @DisplayName("Cuando se busca una venta por ID existente, retorna la venta")
    void whenFindById_thenReturnVenta() throws VentaNotFoundException {
        when(ventaRepository.findById(1L)).thenReturn(Optional.of(venta));

        Venta result = ventaService.findById(1L);

        assertNotNull(result);
        assertEquals("Calle Falsa 123", result.getDireccionCompra());
        verify(ventaRepository).findById(1L);
    }
     //nuevo
    @Test
    @DisplayName("Cuando se busca un ID inexistente, lanza VentaNotFoundException")
    void whenFindByIdInvalid_thenThrowException() {
        when(ventaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(VentaNotFoundException.class, () -> {
            ventaService.findById(99L);
        });
    }

    @Test
    @DisplayName("Cuando se elimina una venta existente, se llama al repositorio")
    void whenDeleteVenta_thenSuccess() throws VentaNotFoundException {
        when(ventaRepository.findById(1L)).thenReturn(Optional.of(venta));
        doNothing().when(ventaRepository).deleteById(1L);

        ventaService.deleteVenta(1L);

        verify(ventaRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Cuando se actualiza una venta, se guardan los cambios correctamente")
    void whenUpdateVenta_thenSuccess() throws VentaNotFoundException {
        Venta ventaNueva = Venta.builder().direccionCompra("Nueva Direccion").build();
        when(ventaRepository.findById(1L)).thenReturn(Optional.of(venta));
        when(ventaRepository.save(any(Venta.class))).thenReturn(venta);

        ventaService.updateVenta(1L, ventaNueva);

        assertEquals("Nueva Direccion", venta.getDireccionCompra());
        verify(ventaRepository).save(any(Venta.class));
    }
}
