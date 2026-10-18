---
id: caracteristicas-de-fecha-y-hora
titulo: Características de fecha y hora
titulo_en: Date and time features
alias:
  - extracción de componentes de fecha
  - variables de calendario
  - características temporales
modulo: 12
submodulo: '12.3'
orden: 15
nivel: basico
prerrequisitos:
  - codificacion-one-hot
  - datos-transversales-longitudinales-y-de-panel
etiquetas:
  - ingeniería de características
  - fechas
  - calendario
  - estacionalidad
resumen: >
  Una marca de fecha y hora contiene varias variables útiles: hora, día de la semana, fin de semana, mes, día
  del año, días festivos. Extraerlas como columnas permite que un modelo aprenda patrones de calendario.
formula: 't \mapsto \big(\text{hora}(t),\ \text{díasem}(t),\ \mathbf{1}\{\text{díasem}(t) \ge 6\},\ \text{mes}(t),\ \dots\big)'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: fecha
    caso: viajes
referencias:
  - clave: hyndman-fpp
  - clave: james-isl
publicado: true
---

## Intuición

Una aplicación de transporte guarda la fecha y hora de cada viaje: `2025-03-08 01:30`. Para un modelo, ese texto es casi inútil tal como está; si se convierte en un solo número (segundos desde 1970, por ejemplo), solo puede expresar una tendencia de largo plazo. Sin embargo, la demanda de viajes depende de la hora (picos al ir y volver del trabajo), del día de la semana (los sábados en la noche son distintos de los martes), del mes y de los días festivos.

Extraer **características de fecha y hora** es descomponer la marca de tiempo en esas piezas y ponerlas como columnas separadas: hora, día de la semana, indicadora de fin de semana, mes, día del año. Cada una permite que el modelo aprenda un patrón de calendario distinto. La elección depende del problema: para pedidos de un supermercado importa el día de la quincena; para ventas de juguetes, la cercanía a diciembre; para el consumo eléctrico, la hora y la temperatura. Algunas de estas variables son cíclicas, y su codificación requiere un cuidado especial.

## Definición

:::definicion[Características de fecha y hora]
Dada una marca de tiempo $t$, sus **características de calendario** son funciones $g_1(t), \dots, g_m(t)$ como:

- $\text{hora}(t) \in \{0, \dots, 23\}$;
- $\text{díasem}(t) \in \{1, \dots, 7\}$, con lunes $= 1$;
- $\text{finde}(t) = \mathbf{1}\{\text{díasem}(t) \ge 6\}$;
- $\text{mes}(t) \in \{1, \dots, 12\}$;
- $\text{díaaño}(t) \in \{1, \dots, 366\}$;
- indicadoras de días festivos o de eventos.

La fila original se reemplaza (o se complementa) por el vector $\big(g_1(t), \dots, g_m(t)\big)$.
:::

:::nota[Qué significa cada símbolo]
- $t$: marca de fecha y hora de una fila.
- $g_1, \dots, g_m$: funciones que extraen cada característica; $m$ es su número.
- $\text{hora}(t)$: hora del día.
- $\text{díasem}(t)$: día de la semana, de lunes ($1$) a domingo ($7$).
- $\text{finde}(t)$: indicadora de sábado o domingo.
- $\text{mes}(t)$, $\text{díaaño}(t)$: mes y número de día dentro del año.
- $\mathbf{1}\{\cdot\}$: función indicadora.
:::

## Cómo usar la visualización

La tabla tiene las marcas de tiempo de ocho viajes. Al reproducir, se extrae una columna nueva en cada paso (hora, día de la semana, fin de semana, mes y día del año), resaltada al aparecer; el encabezado muestra su valor para la primera marca. Las barras muestran un resumen que solo puede calcularse después de extraer la característica: los viajes promedio por franja horaria.

Experimento sugerido: cambiar al caso de compras en línea y observar qué día de la semana concentra más compras.

## Ejemplo

El viaje `2025-03-08 01:30` se descompone así:

1. Hora: 1.
2. Día de la semana: el 1 de marzo de 2025 fue sábado, así que el 8 también: $\text{díasem} = 6$.
3. Fin de semana: $\mathbf{1}\{6 \ge 6\} = 1$.
4. Mes: 3.
5. Día del año: $31 + 28 + 8 = 67$, porque 2025 no es bisiesto.

Con esas columnas, un modelo puede aprender que la madrugada del sábado tiene una demanda que no se parece a la de la madrugada de un martes, combinando hora y fin de semana.

:::figura[Compras en línea: tras extraer el día de la semana, el viernes aparece como el día con más compras promedio.]{componente="FeatureEngineeringViz"}
```yaml
modo: fecha
caso: compras
```
:::

## Propiedades

- **Una sola columna de tiempo se convierte en varias.** Cada una captura un ciclo distinto: diario, semanal, anual.
- **Las características son categóricas o cíclicas.** El día de la semana es nominal para muchos modelos; la hora y el mes son cíclicos, porque después de 23 viene 0 y después de diciembre, enero.

:::figura[El mes como característica cíclica: diciembre y enero quedan contiguos en el círculo aunque como números estén en extremos opuestos.]{componente="FeatureEngineeringViz"}
```yaml
modo: ciclica
periodo: meses
a: 11
b: 0
```
:::

- **Dependen de la zona horaria y del calendario local.** La misma marca en tiempo universal cae en otro día en la Ciudad de México; los festivos cambian por país.

## Errores comunes

- **Usar la marca de tiempo como un número.** Un modelo lineal solo podrá ajustar una tendencia; los patrones diarios y semanales quedan fuera.
- **Tratar la hora como lineal.** Con la hora como número, 23 y 0 quedan en extremos opuestos aunque sean consecutivas; se usa la codificación cíclica.
- **Ignorar la zona horaria.** Datos guardados en tiempo universal desplazan las horas seis horas respecto a la Ciudad de México y desordenan los patrones diarios.

:::figura[Error de tratar la hora como lineal: 23 h y 0 h están a 23 unidades como números y a una distancia muy pequeña en la codificación cíclica.]{componente="FeatureEngineeringViz"}
```yaml
modo: ciclica
periodo: horas
a: 23
b: 0
```
:::

## Conexiones

Los datos con marca de tiempo son [[datos-transversales-longitudinales-y-de-panel|longitudinales]], y su componente estacional se ve en un [[grafico-de-lineas]]. El día de la semana se codifica con la [[codificacion-one-hot]] y la hora o el mes con la [[codificacion-ciclica-con-seno-y-coseno]]. Resumir por grupos de calendario es un caso de [[agregaciones-por-grupo]].

## Formulario

:::formula[Vector de características de calendario]
$$
t \mapsto \big(\text{hora}(t),\ \text{díasem}(t),\ \text{finde}(t),\ \text{mes}(t),\ \text{díaaño}(t)\big)
$$

- $t$: marca de fecha y hora.
:::

:::formula[Indicadora de fin de semana]
$$
\text{finde}(t) = \mathbf{1}\{\text{díasem}(t) \ge 6\}
$$

- $\text{díasem}(t)$: día de la semana con lunes igual a 1.
:::

:::formula[Día del año]
$$
\text{díaaño}(t) = \sum_{k=1}^{\text{mes}(t) - 1} D_k + \text{día}(t)
$$

- $D_k$: número de días del mes $k$ en ese año.
- $\text{día}(t)$: día del mes.
:::
