---
id: metodos-de-calculo-de-cuantiles
titulo: Métodos de cálculo de cuantiles
titulo_en: Sample quantile definitions
alias:
  - tipos de cuantiles de Hyndman y Fan
  - interpolación de percentiles
modulo: 4
submodulo: '4.3'
orden: 7
nivel: basico
prerrequisitos:
  - cuantiles-cuartiles-deciles-y-percentiles
etiquetas:
  - cuantiles
  - interpolación
  - estadísticos de orden
  - software estadístico
resumen: >
  Con pocos datos, el cuantil de orden p no queda determinado de forma única. Los métodos usuales
  eligen una posición h = n p + m entre los datos ordenados e interpolan entre los dos más cercanos.
formula: 'Q(p) = x_{(j)} + g\,\big(x_{(j+1)} - x_{(j)}\big), \qquad h = n\,p + m(p),\ j = \lfloor h \rfloor,\ g = h - j'
visualizacion:
  componente: DataStrip
  parametros:
    modo: cuantiles
    datos: [3, 6, 7, 8, 8, 10, 13, 15]
    familia: cuantil
    p: 0.25
    compararMetodos: true
    variable: Días de incapacidad
    decimales: 0
referencias:
  - clave: wasserman
publicado: true
---

## Intuición

Con 8 datos ordenados, ¿cuál es el primer cuartil? Un cuarto de 8 es 2, así que podría ser el segundo dato. Pero el segundo dato deja 1 dato por debajo y 6 por encima, no exactamente un cuarto. El tercero deja 2 por debajo y 5 por encima. Cualquier valor entre el segundo y el tercer dato cumple razonablemente la idea de "un cuarto por debajo", y no hay una única respuesta correcta.

Por eso distintas calculadoras, hojas de cálculo y programas estadísticos dan cuartiles distintos con los mismos datos. Todos siguen la misma estrategia: asignan al cuantil una **posición** en la lista ordenada, que puede ser fraccionaria, y si cae entre dos datos interpolan. Lo que cambia entre métodos es la regla para calcular esa posición. Con muchos datos las diferencias se vuelven despreciables; con pocos, pueden ser grandes y conviene saber qué método se usó.

## Definición

:::definicion[Cuantil muestral por posición]
Sean $x_{(1)} \le \dots \le x_{(n)}$ los datos ordenados. Un método de cálculo elige una posición
$$
h = n\,p + m(p),
$$
escribe $j = \lfloor h \rfloor$ y $g = h - j$, y define
$$
Q(p) = x_{(j)} + g\,\big(x_{(j+1)} - x_{(j)}\big) = (1 - g)\,x_{(j)} + g\,x_{(j+1)},
$$
con $Q(p) = x_{(1)}$ si $j < 1$ y $Q(p) = x_{(n)}$ si $j \ge n$.
:::

La clasificación de Hyndman y Fan reconoce nueve métodos. Los más usados son:

| Tipo | $m(p)$ | Posición $h$ | Uso |
| --- | --- | --- | --- |
| 6 | $p$ | $(n + 1)p$ | varios libros de texto |
| 7 | $1 - p$ | $(n - 1)p + 1$ | valor por omisión en muchos programas y hojas de cálculo |
| 8 | $(p + 1)/3$ | $(n + \tfrac{1}{3})p + \tfrac{1}{3}$ | aproximadamente insesgado para la mediana de cualquier distribución |
| 9 | $p/4 + 3/8$ | $(n + \tfrac{1}{4})p + \tfrac{3}{8}$ | aproximadamente insesgado si los datos son normales |

Los tipos 1 y 2 no interpolan: toman un dato observado (o el promedio de dos) según la función de distribución empírica. Las visualizaciones comparan ocho de los nueve métodos; se omite el tipo 3, que redondea la posición al dato de índice par más cercano y casi no se usa fuera de un programa estadístico específico.

:::figura[El tercer cuartil de seis tiempos de respuesta con los ocho métodos. Las marcas sobre el eje muestran el valor de cada método; el seleccionado aparece resaltado.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [41, 45, 47, 52, 58, 60]
familia: cuantil
p: 0.75
compararMetodos: true
variable: Tiempo de respuesta
unidad: ms
decimales: 0
```
:::

:::nota[Qué significa cada símbolo]
- $Q(p)$: cuantil de orden $p$.
- $x_{(k)}$: $k$-ésimo dato ordenado de menor a mayor.
- $n$: número de datos.
- $p$: orden del cuantil, entre 0 y 1.
- $m(p)$: corrección de posición propia de cada método.
- $h$: posición fraccionaria del cuantil en la lista ordenada.
- $j = \lfloor h \rfloor$: parte entera de $h$, índice del dato inferior.
- $g = h - j$: parte fraccionaria, peso de la interpolación.
:::

## Cómo usar la visualización

La escalera es la función de distribución empírica de los días de incapacidad de ocho trabajadores. La reproducción recorre varias proporciones y termina en $p = 0.25$. Bajo la escalera, ocho pequeñas marcas muestran el primer cuartil según cada método; el panel lista sus valores, que van de 6 a 6.75 días.

El selector cambia el método principal: el encabezado muestra la posición $h$, los dos datos vecinos y la interpolación. Con el tipo 6, $h = 2.25$; con el tipo 7, $h = 2.75$. Al mover el control de $p$ hacia 0.9, la dispersión entre métodos crece, porque en las colas los datos están más separados.

## Ejemplo

Los ocho días de incapacidad ordenados son 3, 6, 7, 8, 8, 10, 13 y 15. Se calcula $Q(0.25)$ con tres métodos:

1. **Tipo 6:** $h = (n + 1)p = 9 \cdot 0.25 = 2.25$; $j = 2$, $g = 0.25$. $Q = 6 + 0.25\,(7 - 6) = 6.25$.
2. **Tipo 7:** $h = (n - 1)p + 1 = 7 \cdot 0.25 + 1 = 2.75$; $j = 2$, $g = 0.75$. $Q = 6 + 0.75\,(7 - 6) = 6.75$.
3. **Tipo 1:** $n p = 2$ es entero, así que se toma el dato $x_{(2)} = 6$.

Los tres resultados están entre el segundo y el tercer dato, como se espera, pero difieren en hasta 0.75 días. Para la mediana, en cambio, todos los métodos dan 8.

:::figura[El ejemplo con el método tipo 6 seleccionado: la interpolación cae a un cuarto del camino entre 6 y 7.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [3, 6, 7, 8, 8, 10, 13, 15]
familia: cuantil
p: 0.25
metodo: 6
variable: Días de incapacidad
decimales: 0
```
:::

## Propiedades

- **Coinciden en la mediana** cuando el método es simétrico (todos los de la tabla): para $p = 0.5$ dan el dato central o el promedio de los dos centrales.
- **Convergen con $n$:** la diferencia entre métodos es a lo más del orden de la separación entre datos consecutivos, que disminuye al crecer la muestra.
- **Más diferencias en las colas:** cerca de $p = 0$ o $p = 1$ los datos están más separados y los métodos discrepan más.
- **Simetría:** en los tipos 5 a 9, $Q(1 - p)$ calculado en los datos con signo cambiado es $-Q(p)$.

:::figura[Propiedad de convergencia: con 40 lecturas de glucosa, los ocho métodos dan primeros cuartiles que difieren en menos de una unidad.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [78, 81, 83, 84, 85, 86, 86, 87, 88, 88, 89, 90, 90, 91, 91, 92, 92, 93, 93, 94, 95, 95, 96, 96, 97, 98, 98, 99, 100, 101, 102, 103, 104, 105, 107, 109, 111, 114, 118, 125]
familia: cuantil
p: 0.25
compararMetodos: true
variable: Glucosa en ayunas
unidad: mg/dL
decimales: 0
```
:::

## Errores comunes

- **Creer que un programa está equivocado porque da otro cuartil.** Si ambos siguen un método reconocido, los dos son correctos; la diferencia es de convención.
- **Comparar percentiles calculados con métodos distintos.** Al comparar dos grupos, o un reporte de un año con el del siguiente, debe usarse el mismo método.
- **Reportar percentiles extremos con pocos datos.** Con 8 datos, el percentil 90 depende casi por completo del método y del dato más grande.

:::figura[Error con percentiles extremos: el percentil 90 de los ocho días de incapacidad va de 13.4 a 15 según el método.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [3, 6, 7, 8, 8, 10, 13, 15]
familia: cuantil
p: 0.9
compararMetodos: true
variable: Días de incapacidad
decimales: 0
```
:::

## Conexiones

Los métodos precisan la definición de los [[cuantiles-cuartiles-deciles-y-percentiles|cuantiles]] y, con ellos, la de los cuartiles que usan el [[rango-intercuartilico]] y el [[resumen-de-cinco-numeros]]. La [[mediana]] es el caso en que casi todos coinciden. Los métodos 8 y 9 se diseñaron pensando en los gráficos Q-Q, donde los cuantiles muestrales se comparan con los de una distribución teórica.

## Formulario

:::formula[Cuantil por posición e interpolación]
$$
Q(p) = (1 - g)\,x_{(j)} + g\,x_{(j+1)}
$$

- $x_{(j)}, x_{(j+1)}$: datos ordenados vecinos.
- $g$: parte fraccionaria de la posición.
:::

:::formula[Posición general]
$$
h = n\,p + m(p), \qquad j = \lfloor h \rfloor, \qquad g = h - j
$$

- $n$: número de datos; $p$: orden del cuantil.
- $m(p)$: corrección del método.
:::

:::formula[Tipo 6]
$$
h = (n + 1)\,p
$$

- Corresponde a $m(p) = p$.
:::

:::formula[Tipo 7]
$$
h = (n - 1)\,p + 1
$$

- Corresponde a $m(p) = 1 - p$.
:::

:::formula[Tipos 8 y 9]
$$
h_8 = \left(n + \tfrac{1}{3}\right)p + \tfrac{1}{3}, \qquad h_9 = \left(n + \tfrac{1}{4}\right)p + \tfrac{3}{8}
$$

- $h_8$, $h_9$: posiciones de los tipos 8 y 9.
:::
