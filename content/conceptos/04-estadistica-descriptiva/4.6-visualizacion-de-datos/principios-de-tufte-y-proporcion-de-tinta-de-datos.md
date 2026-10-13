---
id: principios-de-tufte-y-proporcion-de-tinta-de-datos
titulo: Principios de Tufte y proporción de tinta de datos
titulo_en: Tufte's principles and data-ink ratio
alias:
  - proporción de tinta de datos
  - data-ink ratio
  - chartjunk
  - adornos gráficos
modulo: 4
submodulo: '4.6'
orden: 23
nivel: basico
prerrequisitos:
  - grafico-de-barras
relaciones:
  - tipo: relacionado
    id: graficos-enganosos
etiquetas:
  - visualización
  - diseño
  - integridad gráfica
  - simplicidad
resumen: >
  Edward Tufte propuso que un buen gráfico dedica la mayor parte de su tinta a los datos. La proporción de
  tinta de datos mide esa fracción, y sus principios piden borrar adornos y mostrar los datos con
  integridad.
formula: '\text{proporción de tinta de datos} = \frac{\text{tinta de datos}}{\text{tinta total del gráfico}}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: tinta
    categorias: [Norte, Centro, Sur, Golfo, Pacífico]
    valores: [42, 57, 35, 48, 51]
    variable: Ventas (millones de pesos)
referencias:
  - clave: tufte
publicado: true
---

## Intuición

Un reporte trimestral presenta las ventas de cinco regiones en un gráfico de barras con fondo gris, marco grueso, rejilla densa, barras con efecto de profundidad, contornos negros, un color distinto por región y una leyenda que repite los nombres que ya están bajo cada barra. Toda esa tinta comunica exactamente lo mismo que cinco barras simples con sus valores: cinco números.

Edward Tufte, en *The Visual Display of Quantitative Information*, propuso medir qué fracción de la tinta de un gráfico representa datos. La llamó **proporción de tinta de datos** y la convirtió en un principio de diseño: borrar todo lo que no sea información, y lo que sea información repetida, mientras no se pierda nada. Los adornos que no comunican, a los que llamó _chartjunk_ (basura gráfica), distraen, ocultan los datos y a veces los distorsionan. Junto con este principio, Tufte formuló otros: mostrar los datos con integridad (sin exagerar efectos), comparar con múltiplos pequeños y buscar alta densidad de información.

## Definición

:::definicion[Proporción de tinta de datos]
La **tinta de datos** es la parte no borrable de un gráfico: la que, si se elimina, se pierde información sobre los datos. La **proporción de tinta de datos** es

$$
R = \frac{\text{tinta de datos}}{\text{tinta total}} = \frac{D}{D + N},
$$

donde $N$ es la tinta que no representa datos (fondos, marcos, rejillas, sombras, decoraciones, leyendas redundantes). Es un número entre 0 y 1; Tufte recomienda acercarlo a 1 dentro de lo razonable.
:::

Principios asociados (Tufte):

1. Mostrar los datos por encima de todo.
2. Maximizar la proporción de tinta de datos, dentro de lo razonable.
3. Borrar la tinta que no es de datos.
4. Borrar la tinta de datos redundante.
5. Revisar y editar.

En la visualización, la tinta se mide como área pintada por opacidad (rellenos) o longitud por grosor (líneas), en un lienzo de tamaño fijo.

:::nota[Qué significa cada símbolo]
- $R$: proporción de tinta de datos.
- $D$: tinta que representa datos (las barras).
- $N$: tinta que no representa datos (adornos, marcos, rejillas, ejes).
:::

## Cómo usar la visualización

El gráfico empieza con siete adornos. Cada paso borra uno: fondo, profundidad, marco, rejilla, leyenda, contornos y colores por barra. El encabezado calcula $R$ en cada etapa y el panel muestra la tinta de datos, que nunca cambia, frente a la que no es de datos.

Cada adorno se puede activar o desactivar por separado con su interruptor.

Experimentos sugeridos:

1. Observar que la tinta de datos permanece en el mismo valor durante toda la animación: lo que se borra no es información.
2. Borrar solo la rejilla y el fondo: son los dos adornos con más tinta.
3. Al final, comprobar que las cinco ventas se leen igual o mejor que al principio.

## Ejemplo

Un gráfico de barras en un lienzo de 600 por 360 unidades:

1. Cinco barras de 60 unidades de ancho con alturas 120, 160, 100, 135 y 145: tinta de datos $D = 60 \cdot (120 + 160 + 100 + 135 + 145) = 60 \cdot 660 = 39600$.
2. Un fondo gris de 500 por 290 unidades con opacidad 0.12: $500 \cdot 290 \cdot 0.12 = 17400$.
3. Una rejilla de 11 líneas horizontales de 500 unidades y grosor 1.2: $11 \cdot 500 \cdot 1.2 = 6600$.
4. Ejes: unas 800 unidades.
5. Con los tres elementos: $R = 39600 / (39600 + 17400 + 6600 + 800) = 39600/64400 \approx 0.61$.
6. Sin fondo ni rejilla: $R = 39600/(39600 + 800) \approx 0.98$.

:::figura[Otro reporte con los mismos adornos: matrículas de cuatro carreras. Al borrar los adornos la proporción sube y la lectura mejora.]{componente="ChartGallery"}
```yaml
grafico: tinta
categorias: [Medicina, Derecho, Ingeniería, Arquitectura]
valores: [820, 640, 910, 380]
variable: Estudiantes inscritos
```
:::

## Propiedades

- **Borrar adornos no borra información:** la tinta de datos es constante mientras $N$ disminuye.
- **Integridad gráfica:** las magnitudes dibujadas deben ser proporcionales a las cantidades; el factor de mentira mide la desviación.
- **Múltiplos pequeños:** muchos gráficos pequeños con la misma escala permiten comparar más que un gráfico grande saturado.
- **Densidad de datos:** un buen gráfico muestra muchos datos por unidad de área sin confundir.

:::figura[Integridad gráfica: el mismo cambio de 50 a 54 dibujado con base en cero y con base truncada. El factor de mentira cuantifica cuánto exagera la versión distorsionada.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: eje-truncado
etiquetas: [Antes, Después]
valores: [50, 54]
variable: Rendimiento (%)
```
:::

:::figura[Múltiplos pequeños: seis distribuciones mensuales con la misma escala horizontal, apiladas para compararlas de un vistazo.]{componente="ChartGallery"}
```yaml
grafico: ridgeline
grupos:
  - nombre: Ene
    forma: normal
    centro: 12
    escala: 3
    n: 120
  - nombre: Feb
    forma: normal
    centro: 13
    escala: 3
    n: 120
  - nombre: Mar
    forma: normal
    centro: 15
    escala: 3
    n: 120
  - nombre: Abr
    forma: normal
    centro: 17
    escala: 3
    n: 120
  - nombre: May
    forma: normal
    centro: 19
    escala: 3
    n: 120
  - nombre: Jun
    forma: normal
    centro: 20
    escala: 2.5
    n: 120
eje:
  variable: Consumo eléctrico diario
  unidad: kWh
solapamiento: 0.75
```
:::

## Errores comunes

- **Llevar el principio al extremo.** Borrar ejes, unidades o etiquetas necesarias reduce la tinta pero también la información; el criterio es "dentro de lo razonable".
- **Confundir la proporción con estética.** Un gráfico con $R$ alto puede seguir siendo engañoso si la escala está manipulada.
- **Considerar los colores siempre como adorno.** Un color por categoría es redundante si las categorías ya están etiquetadas, pero es tinta de datos si codifica una variable adicional.

:::figura[Colores que sí son datos: medidas de 15 aves de tres especies. El color indica la especie, una variable que no aparece en ningún eje; borrarlo eliminaría información.]{componente="ChartGallery"}
```yaml
grafico: matriz-dispersion
variables:
  - nombre: Pico (mm)
    valores: [38, 40, 37, 39, 41, 47, 49, 46, 48, 50, 45, 47, 44, 46, 48]
  - nombre: Ala (mm)
    valores: [190, 195, 186, 192, 198, 196, 200, 193, 199, 203, 215, 222, 212, 218, 225]
  - nombre: Peso (g)
    valores:
      [3700, 3900, 3500, 3800, 4000, 3600, 3800, 3500, 3700, 3900, 5000, 5400, 4800, 5200, 5600]
grupos: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]
nombresGrupos: [Especie A, Especie B, Especie C]
```
:::

## Conexiones

La proporción de tinta de datos aplica directamente al [[grafico-de-barras]], al [[mapa-de-calor]] y a cualquier otro gráfico. El principio de integridad lleva al estudio de los [[graficos-enganosos]] y el factor de mentira, y la elección de qué codificar con posición, longitud o color se discute en [[percepcion-visual-y-codificacion-de-variables]].

## Formulario

:::formula[Proporción de tinta de datos]
$$
R = \frac{D}{D + N}
$$

- $R$: proporción de tinta de datos, entre 0 y 1.
- $D$: tinta de datos; $N$: tinta que no representa datos.
:::

:::formula[Tinta de un relleno]
$$
\text{tinta} = \text{área} \times \text{opacidad}
$$

- área: superficie pintada; opacidad: entre 0 (transparente) y 1 (opaco).
:::

:::formula[Tinta de una línea]
$$
\text{tinta} = \text{longitud} \times \text{grosor}
$$

- longitud y grosor del trazo en las unidades del lienzo.
:::
