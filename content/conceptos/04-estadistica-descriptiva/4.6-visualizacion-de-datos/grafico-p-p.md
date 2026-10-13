---
id: grafico-p-p
titulo: Gráfico P-P
titulo_en: P-P plot
alias:
  - gráfico probabilidad-probabilidad
  - PP plot
modulo: 4
submodulo: '4.6'
orden: 9
nivel: basico
prerrequisitos:
  - funcion-de-distribucion-empirica
  - grafico-q-q
etiquetas:
  - visualización
  - normalidad
  - probabilidades acumuladas
  - diagnóstico
resumen: >
  El gráfico P-P compara las probabilidades acumuladas de los datos con las de una distribución de
  referencia. Si los puntos siguen la diagonal, la forma coincide; es más sensible en el centro que en las colas.
formula: '\left(F_0\!\left(x_{(i)}\right),\ \frac{i - 0.5}{n}\right), \quad i = 1, \dots, n'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: probabilidad
    tipo: pp
    muestra:
      nombre: Tiempos de servicio
      forma: sesgo-derecha
      parametro: 2
      centro: 8
      escala: 3
      n: 80
    eje:
      variable: Tiempo de servicio
      unidad: min
referencias:
  - clave: wasserman
publicado: true
---

## Intuición

El gráfico Q-Q pregunta: ¿el dato que ocupa cierta posición tiene el valor que tendría en una normal? El **gráfico P-P** pregunta lo mismo al revés: para cada dato, ¿qué proporción de los datos está por debajo de él, y qué proporción estaría por debajo si los datos siguieran la distribución de referencia? Si ambas proporciones coinciden en todos los datos, los puntos caen sobre la diagonal del cuadrado unitario.

Como ambos ejes van de 0 a 1, todos los gráficos P-P se ven en la misma escala, sin importar las unidades de los datos. La diferencia práctica con el gráfico Q-Q está en dónde se ven mejor las discrepancias: en el P-P, las colas quedan comprimidas cerca de 0 y de 1, así que es más sensible a diferencias en el centro de la distribución y menos a las colas.

## Definición

:::definicion[Gráfico P-P]
Sean $x_{(1)} \le \dots \le x_{(n)}$ los datos ordenados y $F_0$ la función de distribución de referencia (por ejemplo, una normal con la media y la desviación estándar de los datos). El **gráfico P-P** dibuja los puntos

$$
\left(F_0\!\left(x_{(i)}\right),\ \frac{i - 0.5}{n}\right), \qquad i = 1, \dots, n.
$$

Si los datos siguen $F_0$, los puntos se acercan a la diagonal $y = x$.
:::

La coordenada vertical es, salvo la corrección de 0.5, la función de distribución empírica evaluada en cada dato.

:::figura[Datos que sí siguen la referencia: 80 puntajes de una prueba con forma normal. Los puntos se pegan a la diagonal.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: pp
muestra:
  nombre: Puntajes
  forma: normal
  centro: 500
  escala: 90
  n: 80
eje:
  variable: Puntaje de la prueba
  unidad: puntos
```
:::

:::nota[Qué significa cada símbolo]
- $x_{(i)}$: $i$-ésimo dato ordenado.
- $n$: número de datos.
- $F_0$: función de distribución de referencia.
- $F_0(x_{(i)})$: probabilidad teórica de un valor menor o igual a $x_{(i)}$.
- $(i - 0.5)/n$: proporción empírica asignada al dato $i$.
:::

## Cómo usar la visualización

Los 80 tiempos de servicio se agregan del menor al mayor. Para cada uno, el encabezado muestra su proporción empírica y la probabilidad que le asignaría una normal con la misma media y desviación estándar. La diagonal discontinua es la coincidencia perfecta.

Los puntos forman una S suave alrededor de la diagonal: la asimetría hace que en la parte baja la proporción empírica supere a la normal y que en el centro se crucen. Comparado con el gráfico Q-Q de los mismos datos, la cola derecha casi no se nota: queda comprimida cerca de la esquina superior.

## Ejemplo

Con los cinco tiempos de reacción 4.1, 5.0, 5.3, 6.2 y 7.9 décimas de segundo, $\bar{x} = 5.7$ y $s \approx 1.44$:

1. Proporciones empíricas: 0.1, 0.3, 0.5, 0.7, 0.9.
2. Probabilidades normales: $\Phi\big((4.1 - 5.7)/1.44\big) \approx \Phi(-1.11) \approx 0.133$; para los demás, $0.314$, $0.391$, $0.636$ y $0.937$.
3. Puntos: $(0.133, 0.1)$, $(0.314, 0.3)$, $(0.391, 0.5)$, $(0.636, 0.7)$, $(0.937, 0.9)$.
4. El punto del dato central, 5.3, es el más alejado de la diagonal: la normal ajustada le asigna 0.39, pero ocupa la mitad de los datos.

:::figura[Los cinco tiempos del ejemplo en el gráfico P-P.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: pp
muestra:
  nombre: Reacción
  valores: [4.1, 5.0, 5.3, 6.2, 7.9]
eje:
  variable: Tiempo de reacción
  unidad: décimas de segundo
```
:::

## Propiedades

- **Escala común:** ambos ejes van de 0 a 1, cualquiera que sea la variable.
- **Sensible en el centro, poco en las colas:** las diferencias en los extremos se comprimen cerca de las esquinas.
- **Pasa por los extremos del cuadrado:** los puntos empiezan cerca de $(0, 0)$ y terminan cerca de $(1, 1)$ siempre.
- **Relación con Kolmogorov-Smirnov:** la mayor distancia vertical entre los puntos y la diagonal se relaciona con la estadística de esa prueba.

:::figura[Propiedad de las colas comprimidas: rendimientos de colas pesadas. En el gráfico P-P los puntos casi siguen la diagonal, aunque el gráfico Q-Q de datos similares muestra una S marcada.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: pp
muestra:
  nombre: Rendimientos
  forma: colas-pesadas
  parametro: 3
  centro: 0
  escala: 1
  n: 100
eje:
  variable: Rendimiento diario
  unidad: '%'
```
:::

## Errores comunes

- **Usarlo para revisar colas.** Para decidir si un modelo subestima los valores extremos, el gráfico Q-Q es mucho más informativo.
- **Estimar la referencia con los mismos datos y exigir ajuste perfecto.** Al usar la media y la desviación de la muestra, el ajuste parece mejor de lo que es.
- **Confundirlo con el gráfico Q-Q.** Un P-P recto no implica un Q-Q recto.

:::figura[Una mezcla de dos grupos: los puntos se separan de la diagonal justo en el centro, donde el P-P es más sensible.]{componente="ChartGallery"}
```yaml
grafico: probabilidad
tipo: pp
muestra:
  nombre: Calificaciones
  forma: mezcla
  parametro: 4
  centro: 70
  escala: 6
  n: 100
eje:
  variable: Calificación
  unidad: puntos
```
:::

## Conexiones

El eje vertical del gráfico P-P es la [[funcion-de-distribucion-empirica]] en cada dato. Complementa al [[grafico-q-q]]: uno es más sensible en el centro y el otro en las colas. Ambos sirven para revisar supuestos de normalidad antes de aplicar métodos que la requieren.

## Formulario

:::formula[Puntos del gráfico P-P]
$$
\left(F_0\!\left(x_{(i)}\right),\ \frac{i - 0.5}{n}\right)
$$

- $F_0$: distribución de referencia; $x_{(i)}$: dato ordenado; $n$: número de datos.
:::

:::formula[Referencia normal ajustada]
$$
F_0(x) = \Phi\!\left(\frac{x - \bar{x}}{s}\right)
$$

- $\Phi$: distribución normal estándar; $\bar{x}$, $s$: media y desviación estándar muestrales.
:::
