---
id: grafico-ridgeline
titulo: Gráfico ridgeline
titulo_en: Ridgeline plot
alias:
  - gráfico de crestas
  - joyplot
  - densidades apiladas
modulo: 4
submodulo: '4.6'
orden: 20
nivel: basico
prerrequisitos:
  - grafico-de-densidad
relaciones:
  - tipo: relacionado
    id: diagrama-de-violin
etiquetas:
  - visualización
  - muchos grupos
  - densidad
  - cambio gradual
resumen: >
  El gráfico ridgeline apila las curvas de densidad de muchos grupos ordenados, una encima de otra y con
  un ligero solapamiento, como una cordillera. Hace visible cómo se desplaza o cambia de forma una
  distribución de un grupo al siguiente.
formula: 'y_k(x) = b_k + s\,\hat{f}_k(x),\qquad b_k = k\,\Delta'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: ridgeline
    grupos:
      - nombre: Enero
        forma: normal
        centro: 21
        escala: 2.5
        n: 150
      - nombre: Febrero
        forma: normal
        centro: 23
        escala: 2.5
        n: 150
      - nombre: Marzo
        forma: normal
        centro: 26
        escala: 2.8
        n: 150
      - nombre: Abril
        forma: normal
        centro: 29
        escala: 2.8
        n: 150
      - nombre: Mayo
        forma: sesgo-izquierda
        parametro: 6
        centro: 32
        escala: 2.5
        n: 150
      - nombre: Junio
        forma: sesgo-izquierda
        parametro: 6
        centro: 33
        escala: 2.2
        n: 150
      - nombre: Julio
        forma: sesgo-izquierda
        parametro: 6
        centro: 33.5
        escala: 2
        n: 150
      - nombre: Agosto
        forma: sesgo-izquierda
        parametro: 6
        centro: 33.5
        escala: 2
        n: 150
      - nombre: Septiembre
        forma: normal
        centro: 31
        escala: 2.5
        n: 150
      - nombre: Octubre
        forma: normal
        centro: 27
        escala: 3
        n: 150
      - nombre: Noviembre
        forma: normal
        centro: 23.5
        escala: 3
        n: 150
      - nombre: Diciembre
        forma: normal
        centro: 21
        escala: 2.8
        n: 150
    eje:
      variable: Temperatura máxima diaria
      unidad: °C
    solapamiento: 1
referencias:
  - clave: tufte
publicado: true
---

## Intuición

Una estación meteorológica de Monterrey registra la temperatura máxima de cada día durante varios años. Para ver cómo cambia la distribución a lo largo del año se podrían dibujar doce histogramas, uno por mes, pero ocuparían mucho espacio y sería difícil compararlos. La alternativa es estimar la curva de densidad de cada mes y apilarlas de arriba abajo, en el orden de los meses, dejando que cada curva se monte un poco sobre la siguiente.

El resultado parece una cordillera vista de perfil, y de ahí su nombre: **gráfico ridgeline** (de crestas). Al recorrerlo de arriba abajo se ve cómo la cresta se mueve a la derecha en primavera, se queda alta y angosta en verano y regresa en otoño. El solapamiento ahorra espacio vertical y ayuda a comparar cada mes con el siguiente, que es exactamente la comparación que importa cuando los grupos tienen un orden.

## Definición

:::definicion[Gráfico ridgeline]
Sean $K$ grupos ordenados con densidades estimadas $\hat{f}_1, \dots, \hat{f}_K$. El **gráfico ridgeline** dibuja, para cada grupo $k$, la curva

$$
y_k(x) = b_k + s\,\hat{f}_k(x),
$$

donde $b_k = k\,\Delta$ es la línea base del grupo, separada $\Delta$ de la siguiente, y $s$ es un factor de escala común. Si la altura máxima $s \max_x \hat{f}_k(x)$ es mayor que $\Delta$, la curva invade la fila de arriba; el **solapamiento** es esa invasión expresada en filas.
:::

Supuestos:

- Los grupos tienen un orden natural (meses, edades, años) o se ordenan por su mediana.
- Todas las curvas comparten el eje horizontal y el factor $s$, para que alturas y anchos sean comparables.
- Cada curva es una densidad con área 1, de modo que no refleja cuántos datos tiene cada grupo.

:::nota[Qué significa cada símbolo]
- $K$: número de grupos.
- $\hat{f}_k(x)$: densidad estimada del grupo $k$ en el valor $x$.
- $y_k(x)$: altura en pantalla de la curva del grupo $k$.
- $b_k$: línea base del grupo $k$; $\Delta$: separación entre líneas base.
- $s$: factor de escala común de las densidades.
:::

## Cómo usar la visualización

Las crestas aparecen una por una, de enero a diciembre, y el encabezado muestra la mediana de la última. El panel lateral lista la mediana de cada mes.

El control **Solapamiento entre crestas** va de 0 (cada curva en su fila, sin invadir otra) a 3 (crestas muy altas que cubren varias filas).

Experimentos sugeridos:

1. Con solapamiento 0, las curvas se aplanan y cuesta ver el desplazamiento; con 1 se aprecia la cordillera.
2. Subir a 3: las crestas del verano tapan a los meses anteriores.
3. Comparar mayo con julio: la cresta de julio es más angosta y su cola izquierda es más larga, señal de asimetría negativa.

## Ejemplo

Con $K = 12$ meses y separación $\Delta = 40$ píxeles:

1. Las líneas base quedan en $b_1 = 40$, $b_2 = 80$, ..., $b_{12} = 480$ píxeles (contando hacia abajo desde el borde superior).
2. Si la densidad más alta de todos los meses vale $0.2$ y se quiere un solapamiento de una fila, la cresta más alta debe medir $2\Delta = 80$ píxeles, así que $s = 80 / 0.2 = 400$.
3. Un mes con densidad máxima $0.1$ alcanza $400 \cdot 0.1 = 40$ píxeles: justo llega a la línea base de arriba, sin invadirla.

:::figura[Cuatro grupos de edad con su tiempo diario frente a pantallas: con pocos grupos las crestas casi no se tocan y cada una se lee completa.]{componente="ChartGallery"}
```yaml
grafico: ridgeline
grupos:
  - nombre: 12 a 17 años
    forma: sesgo-derecha
    parametro: 6
    centro: 5.5
    escala: 1.5
    n: 200
  - nombre: 18 a 29 años
    forma: sesgo-derecha
    parametro: 6
    centro: 5
    escala: 1.5
    n: 200
  - nombre: 30 a 49 años
    forma: sesgo-derecha
    parametro: 6
    centro: 3.8
    escala: 1.3
    n: 200
  - nombre: 50 años o más
    forma: sesgo-derecha
    parametro: 6
    centro: 2.8
    escala: 1.2
    n: 200
eje:
  variable: Horas diarias frente a pantallas
  unidad: h
solapamiento: 0.5
```
:::

## Propiedades

- **Compacto con muchos grupos:** doce o más distribuciones caben en el espacio de unas pocas.
- **Cambios graduales visibles:** el desplazamiento de la cresta de un grupo al siguiente se sigue con la vista.
- **Forma completa:** a diferencia de una caja, muestra asimetrías y varios modos.

:::figura[Cambio de forma, no solo de posición: tiempo de entrega de un servicio por semana. Una sola acumulación se divide en dos que se separan semana a semana, a medida que una parte de los pedidos empieza a llegar tarde.]{componente="ChartGallery"}
```yaml
grafico: ridgeline
grupos:
  - nombre: Semana 1
    forma: normal
    centro: 30
    escala: 4
    n: 200
  - nombre: Semana 2
    forma: mezcla
    parametro: 2
    centro: 32
    escala: 4
    n: 200
  - nombre: Semana 3
    forma: mezcla
    parametro: 3
    centro: 34
    escala: 4
    n: 200
  - nombre: Semana 4
    forma: mezcla
    parametro: 4
    centro: 36
    escala: 4
    n: 200
  - nombre: Semana 5
    forma: mezcla
    parametro: 5
    centro: 38
    escala: 4
    n: 200
eje:
  variable: Tiempo de entrega
  unidad: min
solapamiento: 1
```
:::

## Errores comunes

- **Solapamiento excesivo.** Las crestas de adelante tapan a las de atrás y se pierden partes de las distribuciones.
- **Grupos sin orden.** Si las categorías no tienen orden ni se ordenan por un estadístico, el efecto de desplazamiento gradual desaparece.
- **Leer la altura como número de datos.** Cada curva tiene área 1: un grupo con 10 datos y otro con 10000 pueden tener crestas de la misma altura.

:::figura[Grupos en desorden: los mismos meses de Monterrey en orden alfabético. La cordillera se vuelve un zigzag sin patrón.]{componente="ChartGallery"}
```yaml
grafico: ridgeline
grupos:
  - nombre: Abril
    forma: normal
    centro: 29
    escala: 2.8
    n: 150
  - nombre: Agosto
    forma: sesgo-izquierda
    parametro: 6
    centro: 33.5
    escala: 2
    n: 150
  - nombre: Diciembre
    forma: normal
    centro: 21
    escala: 2.8
    n: 150
  - nombre: Enero
    forma: normal
    centro: 21
    escala: 2.5
    n: 150
  - nombre: Febrero
    forma: normal
    centro: 23
    escala: 2.5
    n: 150
  - nombre: Julio
    forma: sesgo-izquierda
    parametro: 6
    centro: 33.5
    escala: 2
    n: 150
  - nombre: Junio
    forma: sesgo-izquierda
    parametro: 6
    centro: 33
    escala: 2.2
    n: 150
  - nombre: Marzo
    forma: normal
    centro: 26
    escala: 2.8
    n: 150
eje:
  variable: Temperatura máxima diaria
  unidad: °C
solapamiento: 1
```
:::

:::figura[La altura no cuenta datos: dos sucursales con la misma distribución de tiempos de atención, una con 12 clientes y otra con 2000. Las crestas tienen área 1 y alturas parecidas pese a la enorme diferencia de tamaño.]{componente="ChartGallery"}
```yaml
grafico: ridgeline
grupos:
  - nombre: Sucursal pequeña
    forma: normal
    centro: 15
    escala: 3
    n: 12
  - nombre: Sucursal grande
    forma: normal
    centro: 15
    escala: 3
    n: 2000
eje:
  variable: Tiempo de atención
  unidad: min
solapamiento: 0.5
```
:::

## Conexiones

Cada cresta es un [[grafico-de-densidad]]; el ridgeline es la versión apilada para muchos grupos, mientras que el [[diagrama-de-violin]] los coloca lado a lado con simetría. Para pocos grupos con pocos datos, los [[graficos-de-enjambre-y-de-franjas]] muestran cada observación. La asimetría y la [[multimodalidad]] que revela cada cresta se estudian en la forma de la distribución.

## Formulario

:::formula[Curva de cada grupo]
$$
y_k(x) = b_k + s\,\hat{f}_k(x)
$$

- $y_k(x)$: altura de la curva del grupo $k$ en el valor $x$.
- $b_k$: línea base del grupo $k$.
- $s$: factor de escala común.
- $\hat{f}_k(x)$: densidad estimada del grupo $k$.
:::

:::formula[Líneas base equiespaciadas]
$$
b_k = k\,\Delta,\qquad k = 1, \dots, K
$$

- $\Delta$: separación entre líneas base; $K$: número de grupos.
:::

:::formula[Factor de escala para un solapamiento dado]
$$
s = \frac{(1 + o)\,\Delta}{\max_k \max_x \hat{f}_k(x)}
$$

- $o$: solapamiento deseado, en filas.
- $\max_k \max_x \hat{f}_k(x)$: la densidad más alta entre todos los grupos.
:::
