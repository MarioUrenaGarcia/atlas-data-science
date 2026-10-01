---
id: resumen-de-cinco-numeros
titulo: Resumen de cinco números
titulo_en: Five-number summary
alias:
  - resumen de Tukey
  - cinco números
modulo: 4
submodulo: '4.3'
orden: 12
nivel: basico
prerrequisitos:
  - rango-intercuartilico
etiquetas:
  - resumen
  - cuartiles
  - mínimo y máximo
  - diagrama de caja
resumen: >
  El resumen de cinco números describe un conjunto de datos con su mínimo, primer cuartil, mediana,
  tercer cuartil y máximo; es la base del diagrama de caja.
formula: '\big(x_{(1)},\ Q_1,\ \tilde{x},\ Q_3,\ x_{(n)}\big)'
visualizacion:
  componente: DataStrip
  parametros:
    modo: caja
    datos: [52, 55, 58, 60, 61, 63, 64, 66, 70, 95]
    variable: Frecuencia cardiaca en reposo de un grupo de oficina
    unidad: lpm
    decimales: 0
referencias:
  - clave: degroot
  - clave: tufte
publicado: true
---

## Intuición

Para describir cómo se reparten diez frecuencias cardiacas no hace falta leer las diez. Basta con cinco marcas: dónde empiezan, dónde queda el primer cuarto, dónde está la mitad, dónde termina el tercer cuarto y dónde acaban. Con esos cinco números se sabe el centro, qué tan dispersa está la mitad central, qué tan largas son las colas y si una cola es más larga que la otra.

El estadístico John Tukey propuso este **resumen de cinco números** como primer vistazo a cualquier conjunto de datos, y lo convirtió en dibujo: el diagrama de caja. Su ventaja es que no supone ninguna forma particular de los datos y que, salvo el mínimo y el máximo, sus números resisten los valores extremos. Comparar dos grupos con sus cinco números, uno al lado del otro, suele revelar más que comparar solo sus medias.

## Definición

:::definicion[Resumen de cinco números]
Para datos ordenados $x_{(1)} \le \dots \le x_{(n)}$, el **resumen de cinco números** es
$$
\big(x_{(1)},\ Q_1,\ \tilde{x},\ Q_3,\ x_{(n)}\big),
$$
formado por el mínimo, el primer cuartil, la mediana, el tercer cuartil y el máximo.
:::

Divide los datos en cuatro grupos con aproximadamente el mismo número de observaciones. De él se obtienen el [[rango]] $x_{(n)} - x_{(1)}$ y el [[rango-intercuartilico]] $Q_3 - Q_1$. En el diagrama de caja, los bigotes no siempre llegan al mínimo y al máximo: se detienen en el dato más extremo dentro de las vallas $Q_1 - 1.5\,\mathrm{RIQ}$ y $Q_3 + 1.5\,\mathrm{RIQ}$, y lo que queda fuera se dibuja como punto aparte.

:::figura[Los primeros pasos con la longitud de once peces: datos ordenados, mediana y cuartiles. La animación se detiene antes de dibujar la caja.]{componente="DataStrip"}
```yaml
modo: caja
datos: [3.2, 3.5, 3.9, 4.1, 4.4, 4.6, 4.8, 5.3, 5.9, 6.4, 7.8]
hasta: 2
variable: Longitud
unidad: cm
decimales: 1
```
:::

:::nota[Qué significa cada símbolo]
- $x_{(1)}$: mínimo; $x_{(n)}$: máximo.
- $Q_1$: primer cuartil; $Q_3$: tercer cuartil.
- $\tilde{x}$: mediana, también llamada $Q_2$.
- $n$: número de datos.
- $\mathrm{RIQ} = Q_3 - Q_1$: rango intercuartílico.
- $1.5$: constante usual de las vallas de Tukey.
:::

## Cómo usar la visualización

La animación construye el diagrama de caja en siete pasos: ordena los datos, marca la mediana, los cuartiles, la caja, las vallas, los bigotes y los atípicos. El encabezado muestra en cada paso el cálculo correspondiente y el panel reúne los cinco números.

La frecuencia de 95 latidos por minuto queda fuera de la valla superior y aparece como atípica; el bigote termina en 70. Al arrastrar ese dato hasta 72, el máximo cambia pero la mediana y los cuartiles no, y el punto deja de estar fuera de las vallas. El control $k$ mueve las vallas: con $k = 3$ solo se marcan los datos muy lejanos.

## Ejemplo

Diez frecuencias cardiacas en reposo, en latidos por minuto: 52, 55, 58, 60, 61, 63, 64, 66, 70, 95.

1. Mínimo: 52. Máximo: 95.
2. Mediana: promedio del quinto y sexto dato, $(61 + 63)/2 = 62$.
3. Cuartiles (método de interpolación usual): $Q_1 = 58.5$ y $Q_3 = 65.5$.
4. Resumen: $(52,\ 58.5,\ 62,\ 65.5,\ 95)$.
5. Lectura: la mitad central está en un intervalo de solo 7 lpm, pero la distancia de $Q_3$ al máximo es de 29.5 lpm: hay una cola larga hacia arriba, causada por un solo dato.

:::figura[El diagrama completo del ejemplo, con el dato de 95 lpm marcado como atípico.]{componente="DataStrip"}
```yaml
modo: caja
datos: [52, 55, 58, 60, 61, 63, 64, 66, 70, 95]
variable: Frecuencia cardiaca
unidad: lpm
decimales: 0
dominio: [45, 100]
```
:::

## Propiedades

- **Cuartos de los datos:** entre cada par de números consecutivos del resumen hay aproximadamente 25 % de los datos.
- **Asimetría a simple vista:** si $Q_3 - \tilde{x}$ es mucho mayor que $\tilde{x} - Q_1$, o el bigote superior es mucho más largo, los datos tienen cola a la derecha.
- **Resistencia parcial:** $Q_1$, $\tilde{x}$ y $Q_3$ son resistentes; el mínimo y el máximo no.
- **Equivarianza monótona:** aplicar una transformación creciente, como el logaritmo, transforma los cinco números de la misma manera (salvo por la interpolación de los cuartiles).

:::figura[Propiedad de las vallas: las mismas frecuencias con k = 3. La valla superior pasa a 86.5 lpm y el dato de 95 sigue fuera, pero solo por una distancia pequeña.]{componente="DataStrip"}
```yaml
modo: caja
datos: [52, 55, 58, 60, 61, 63, 64, 66, 70, 95]
k: 3
variable: Frecuencia cardiaca
unidad: lpm
decimales: 0
dominio: [45, 100]
```
:::

## Errores comunes

- **Creer que la caja describe toda la forma.** Datos con dos grupos separados pueden producir una caja ancha y simétrica que oculta que casi nadie está en el centro.
- **Leer los bigotes como mínimo y máximo.** Si hay atípicos, los bigotes terminan antes; el mínimo o el máximo son los puntos aislados.
- **Comparar cajas de grupos de tamaños muy distintos sin decirlo.** Una caja de 8 datos y una de 800 se ven igual de sólidas, pero la primera es mucho más incierta.

:::figura[Una caja que oculta dos grupos: tiempos de doce trayectos, seis cortos y seis largos. La mediana, 20 minutos, cae donde no hay ningún trayecto.]{componente="DataStrip"}
```yaml
modo: caja
datos: [10, 11, 11, 12, 12, 13, 27, 28, 28, 29, 29, 30]
variable: Duración del trayecto
unidad: min
decimales: 0
```
:::

## Conexiones

El resumen reúne la [[mediana]], los [[cuantiles-cuartiles-deciles-y-percentiles|cuartiles]] y los extremos que definen el [[rango]]; la distancia entre cuartiles es el [[rango-intercuartilico]]. Su representación gráfica es el diagrama de caja, y las vallas de Tukey son el criterio más usado para detectar valores atípicos en el análisis exploratorio.

## Formulario

:::formula[Resumen de cinco números]
$$
\big(x_{(1)},\ Q_1,\ \tilde{x},\ Q_3,\ x_{(n)}\big)
$$

- $x_{(1)}$, $x_{(n)}$: mínimo y máximo.
- $Q_1$, $Q_3$: primer y tercer cuartil.
- $\tilde{x}$: mediana.
:::

:::formula[Vallas del diagrama de caja]
$$
L = Q_1 - k\,\mathrm{RIQ}, \qquad U = Q_3 + k\,\mathrm{RIQ}
$$

- $L$, $U$: valla inferior y superior.
- $k$: constante, usualmente 1.5.
- $\mathrm{RIQ} = Q_3 - Q_1$.
:::
