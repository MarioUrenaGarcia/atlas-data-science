---
id: tau-de-kendall
titulo: Tau de Kendall
titulo_en: Kendall's tau
alias:
  - coeficiente de Kendall
  - tau-b
  - correlación de rangos de Kendall
modulo: 4
submodulo: '4.5'
orden: 4
nivel: basico
prerrequisitos:
  - correlacion-de-spearman
  - combinaciones
etiquetas:
  - asociación
  - pares concordantes
  - rangos
  - relación monótona
resumen: >
  La tau de Kendall compara todos los pares de observaciones: cuenta cuántos están en el mismo orden
  en ambas variables y cuántos en orden opuesto, y resume la diferencia entre -1 y 1.
formula: '\tau = \frac{C - D}{\binom{n}{2}}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: correlacion
    medida: kendall
    lecturas: [kendall, spearman]
    puntos: [[1, 2], [2, 1], [3, 4], [4, 3], [5, 5]]
    nombres:
      x: Lugar asignado por el juez A
      y: Lugar asignado por el juez B
    decimales: 0
referencias:
  - clave: agresti
publicado: true
---

## Intuición

Dos jueces ordenan a cinco bailarines del primero al quinto lugar. ¿Qué tanto coinciden? Una forma natural de responder es tomar a los bailarines de dos en dos y preguntar: ¿ambos jueces pusieron al mismo bailarín por delante? Si sí, la pareja es **concordante**; si cada juez prefirió a uno distinto, es **discordante**. Con cinco bailarines hay diez parejas.

La **tau de Kendall** es la diferencia entre parejas concordantes y discordantes, dividida entre el número de parejas. Si los jueces coinciden en todo, todas las parejas son concordantes y tau vale 1; si un juez invirtió el orden del otro, todas son discordantes y vale $-1$. Tiene una lectura directa en probabilidad: tau es la probabilidad de que una pareja elegida al azar esté en el mismo orden menos la probabilidad de que esté en orden opuesto.

## Definición

:::definicion[Tau de Kendall]
Para pares $(x_i, y_i)$, una pareja de observaciones $i < j$ es **concordante** si $(x_i - x_j)(y_i - y_j) > 0$ y **discordante** si $(x_i - x_j)(y_i - y_j) < 0$. Con $C$ parejas concordantes y $D$ discordantes, sin empates,
$$
\tau = \frac{C - D}{\binom{n}{2}}.
$$
Con empates se usa la versión $\tau_b = \dfrac{C - D}{\sqrt{(C + D + T_x)(C + D + T_y)}}$, donde $T_x$ y $T_y$ son las parejas empatadas solo en $x$ o solo en $y$.
:::

Como Spearman, solo depende del orden de los datos y vale lo mismo si se aplican transformaciones crecientes a cualquiera de las variables.

:::figura[Concordancia casi perfecta entre la edad de seis árboles y su diámetro: solo dos parejas quedan en orden opuesto.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: kendall
lecturas: [kendall]
puntos: [[1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5]]
nombres:
  x: Edad del árbol (decenas de años)
  y: Diámetro del tronco
decimales: 0
```
:::

:::nota[Qué significa cada símbolo]
- $\tau$: tau de Kendall.
- $C$: número de parejas concordantes.
- $D$: número de parejas discordantes.
- $\binom{n}{2} = n(n-1)/2$: número total de parejas de $n$ observaciones.
- $(x_i - x_j)(y_i - y_j)$: positivo si la pareja está en el mismo orden en ambas variables.
- $\tau_b$: versión corregida por empates; $T_x$, $T_y$: parejas empatadas solo en $x$ o solo en $y$.
:::

## Cómo usar la visualización

Cada punto es un bailarín: su posición horizontal es el lugar que le dio el juez A y la vertical, el del juez B. La reproducción recorre las diez parejas una por una y dibuja el segmento que las une: azul si es concordante (el segmento sube) y naranja si es discordante (baja). El encabezado lleva la cuenta de $C$ y $D$.

Al terminar, $C = 8$, $D = 2$ y $\tau = 0.6$. Al arrastrar al bailarín 5 hacia abajo hasta el lugar 1 del juez B, las cuatro parejas que lo incluyen dejan de ser concordantes y tau baja de forma visible en el panel.

## Ejemplo

Lugares de cinco bailarines: juez A (1, 2, 3, 4, 5) y juez B (2, 1, 4, 3, 5).

1. Hay $\binom{5}{2} = 10$ parejas.
2. Discordantes: la pareja de los bailarines 1 y 2 (A los ordena 1-2, B los ordena 2-1) y la de los bailarines 3 y 4. Son $D = 2$.
3. Las otras ocho son concordantes: $C = 8$.
4. $\tau = (8 - 2)/10 = 0.6$.
5. Interpretación: si se eligen dos bailarines al azar, la probabilidad de que los jueces los ordenen igual es $0.8$ y la de que los ordenen al revés es $0.2$; la diferencia es $0.6$.

:::figura[Las parejas del ejemplo recorridas una por una con la tau acumulada.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: kendall
lecturas: [kendall]
puntos: [[1, 2], [2, 1], [3, 4], [4, 3], [5, 5]]
nombres:
  x: Juez A
  y: Juez B
decimales: 0
```
:::

## Propiedades

- **Interpretación probabilística:** $\tau = P(\text{concordante}) - P(\text{discordante})$ para una pareja tomada al azar, sin empates.
- **Menor en magnitud que Spearman:** para los mismos datos, $|\tau|$ suele ser menor que $|r_s|$; en datos normales, $\tau \approx \frac{2}{3}\,r_s$ aproximadamente para correlaciones moderadas.
- **Invariante ante transformaciones crecientes** de cualquiera de las variables.
- **Costo:** requiere revisar $n(n-1)/2$ parejas, aunque existen algoritmos de orden $n \log n$.

:::figura[Tau frente a Spearman con los árboles de seis edades: tau es 0.6 y Spearman 0.83 para el mismo ordenamiento.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: kendall
lecturas: [kendall, spearman]
puntos: [[1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5]]
nombres:
  x: Edad del árbol
  y: Diámetro del tronco
decimales: 0
```
:::

## Errores comunes

- **Compararla directamente con Spearman o Pearson.** Una tau de 0.6 indica una concordancia que en Spearman se vería como 0.8 aproximadamente; las escalas no son iguales.
- **Ignorar los empates.** Con escalas ordinales de pocas categorías hay muchas parejas empatadas, y la fórmula sin corrección subestima la asociación; se usa $\tau_b$.
- **Usarla para relaciones no monótonas.** Igual que Spearman, no detecta una relación en forma de U.

:::figura[Empates frecuentes: satisfacción de 1 a 3 frente a años de antigüedad de seis empleados. Varias parejas empatan en satisfacción y el panel reporta la versión corregida.]{componente="AssociationViz"}
```yaml
modo: correlacion
medida: kendall
lecturas: [kendall, spearman]
puntos: [[1, 1], [2, 1], [3, 2], [4, 2], [5, 3], [6, 2]]
nombres:
  x: Años de antigüedad
  y: Satisfacción (1 a 3)
decimales: 0
```
:::

## Conexiones

La tau de Kendall mide la misma concordancia de orden que la [[correlacion-de-spearman]], pero contando parejas, cuyo número es una [[combinaciones|combinación]] $\binom{n}{2}$. Ambas son alternativas robustas al [[coeficiente-de-correlacion-de-pearson]]. La comparación de órdenes por pares también aparece en métricas de ranking en aprendizaje automático.

## Formulario

:::formula[Tau sin empates]
$$
\tau = \frac{C - D}{\binom{n}{2}}
$$

- $C$, $D$: parejas concordantes y discordantes; $n$: número de observaciones.
:::

:::formula[Tau-b con empates]
$$
\tau_b = \frac{C - D}{\sqrt{(C + D + T_x)(C + D + T_y)}}
$$

- $T_x$, $T_y$: parejas empatadas solo en $x$ o solo en $y$.
:::

:::formula[Interpretación probabilística]
$$
\tau = P(\text{concordante}) - P(\text{discordante})
$$

- Probabilidades para una pareja de observaciones elegida al azar.
:::
