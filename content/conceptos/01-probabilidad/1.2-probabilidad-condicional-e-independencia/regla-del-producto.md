---
id: regla-del-producto
titulo: Regla del producto
titulo_en: Multiplication rule
alias:
  - regla de la multiplicación
  - probabilidad de la intersección
modulo: 1
submodulo: '1.2'
orden: 2
nivel: basico
prerrequisitos:
  - probabilidad-condicional
relaciones:
  - tipo: caso-particular
    id: regla-de-la-cadena-de-probabilidad
etiquetas:
  - intersección
  - multiplicación
  - experimentos por etapas
  - sin reemplazo
resumen: >
  La probabilidad de que ocurran A y B es la probabilidad de A multiplicada por la probabilidad de B
  dado A. Permite calcular intersecciones en experimentos que ocurren por etapas.
formula: 'P(A \cap B) = P(A)\,P(B \mid A) = P(B)\,P(A \mid B)'
visualizacion:
  componente: ProbabilitySquare
  parametros:
    modo: producto
    particion:
      - etiqueta: Llueve
        prob: 0.3
      - etiqueta: No llueve
        prob: 0.7
    evento: Tráfico
    condicionales: [0.8, 0.25]
    columna: 0
    contexto: Mañana llueve con probabilidad 0.3; con lluvia hay tráfico intenso con probabilidad 0.8 y sin lluvia con 0.25.
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.3'
  - clave: ross-probabilidad
    capitulo: '3'
publicado: true
---

## Intuición

Para que una persona llegue tarde por tráfico un día de lluvia tienen que pasar dos cosas: que llueva y, ya lloviendo, que haya tráfico. Si llueve el 30 % de los días y con lluvia hay tráfico el 80 % de las veces, entonces la lluvia con tráfico ocurre el 80 % del 30 % de los días, es decir, el 24 %.

La regla del producto formaliza ese razonamiento por etapas: la probabilidad de que ocurran dos cosas es la probabilidad de la primera multiplicada por la de la segunda, calculada sabiendo que la primera ya ocurrió. Geométricamente, en un cuadrado que representa todo el espacio, la primera probabilidad es el ancho de una columna y la condicional es la fracción de esa columna que ocupa el segundo evento; el área del rectángulo resultante es el producto.

La regla es especialmente útil cuando la segunda probabilidad cambia según lo que pasó en la primera etapa, como al sacar cartas o elegir personas sin reemplazo.

## Definición

:::teorema[Regla del producto]
Para eventos $A$ y $B$ con $P(A) > 0$,
$$
P(A \cap B) = P(A)\,P(B \mid A).
$$
De manera simétrica, si $P(B) > 0$, $P(A \cap B) = P(B)\,P(A \mid B)$.
:::

:::demostracion
Basta multiplicar por $P(A)$ ambos lados de la definición $P(B \mid A) = P(A \cap B)/P(A)$.
:::

:::figura[El cuadrado del producto con los datos de la visualización principal, enfocado en la columna "No llueve": ancho 0.7, altura 0.25 y área 0.175 para "no llueve y hay tráfico".]{componente="ProbabilitySquare"}
```yaml
modo: producto
particion:
  - etiqueta: Llueve
    prob: 0.3
  - etiqueta: No llueve
    prob: 0.7
evento: Tráfico
condicionales: [0.8, 0.25]
columna: 1
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: eventos; $A$ es la primera etapa y $B$ la segunda.
- $A \cap B$: ocurren $A$ y $B$.
- $P(A)$: probabilidad de la primera etapa (ancho de la columna).
- $P(B \mid A)$: probabilidad de $B$ sabiendo que ocurrió $A$ (altura dentro de la columna).
- $\frac{a}{b}$: en el ejemplo de cartas, cociente de cartas favorables entre cartas restantes.
:::

## Cómo usar la visualización

El cuadrado representa todos los días posibles. La columna izquierda, de ancho 0.3, son los días con lluvia; dentro de cada columna, la parte inferior son los días con tráfico. La animación recorre la regla: resalta la columna (su ancho es $P(\text{llueve})$), después la parte inferior (su altura relativa es $P(\text{tráfico} \mid \text{llueve})$) y al final muestra el área como producto.

Al subir $P(\text{llueve})$ la columna se ensancha y el área crece proporcionalmente. Al bajar $P(\text{tráfico} \mid \text{llueve})$ a 0.25, igual que en la otra columna, la línea que separa el tráfico queda a la misma altura en las dos columnas: en ese caso la lluvia no informa sobre el tráfico y el producto se reduce a $P(\text{llueve})\,P(\text{tráfico})$.

## Ejemplo

Se sacan dos cartas, sin reemplazo, de una baraja inglesa. ¿Cuál es la probabilidad de que ambas sean ases?

1. Sea $A_1$ = "la primera es as": $P(A_1) = 4/52$.
2. Si la primera fue as, quedan 51 cartas con 3 ases: $P(A_2 \mid A_1) = 3/51$.
3. Por la regla del producto: $P(A_1 \cap A_2) = \dfrac{4}{52} \cdot \dfrac{3}{51} = \dfrac{12}{2652} = \dfrac{1}{221} \approx 0.0045$.
4. Comprobación por conteo: hay $\binom{4}{2} = 6$ pares de ases entre $\binom{52}{2} = 1326$ pares de cartas, y $6/1326 = 1/221$.

:::figura[El ejemplo como árbol de dos etapas: la rama "as" y luego "as" multiplica 4/52 por 3/51. Las demás hojas completan la probabilidad total 1.]{componente="ProbabilityTree"}
```yaml
niveles: [Primera carta, Segunda carta]
ramas:
  - etiqueta: As
    prob: 0.0769230769
    ramas:
      - etiqueta: As
        prob: 0.0588235294
      - etiqueta: Otra
        prob: 0.9411764706
  - etiqueta: Otra
    prob: 0.9230769231
    ramas:
      - etiqueta: As
        prob: 0.0784313725
      - etiqueta: Otra
        prob: 0.9215686275
consultas:
  - nombre: Dos ases
    hojas: [As/As]
  - nombre: Exactamente un as
    hojas: [As/Otra, Otra/As]
```
:::

## Propiedades

- **Dos órdenes:** $P(A)\,P(B \mid A) = P(B)\,P(A \mid B)$; ambos productos valen $P(A \cap B)$ y de esa igualdad sale el teorema de Bayes.
- **Caso independiente:** si $P(B \mid A) = P(B)$, la regla se reduce a $P(A \cap B) = P(A)\,P(B)$.
- **Varios eventos:** aplicada repetidamente, da la regla de la cadena $P(A_1 \cap \dots \cap A_n) = P(A_1)\,P(A_2 \mid A_1) \cdots P(A_n \mid A_1 \cap \dots \cap A_{n-1})$.
- **Cota:** como $P(B \mid A) \le 1$, siempre $P(A \cap B) \le P(A)$.

:::figura[Caso independiente: con la misma altura de tráfico en ambas columnas (0.4), la línea divisoria es recta y P(llueve y tráfico) = 0.3 por 0.4 = P(llueve) P(tráfico).]{componente="ProbabilitySquare"}
```yaml
modo: independencia
particion:
  - etiqueta: Llueve
    prob: 0.3
  - etiqueta: No llueve
    prob: 0.7
evento: Tráfico
condicionales: [0.4, 0.4]
```
:::

## Errores comunes

- **Multiplicar probabilidades sin condicionar.** $P(A \cap B) = P(A)\,P(B)$ solo vale si los eventos son independientes. En el ejemplo de los ases, $\frac{4}{52} \cdot \frac{4}{52}$ es la respuesta con reemplazo, no sin reemplazo.
- **Usar la condicional en el sentido equivocado.** $P(A)\,P(A \mid B)$ no tiene sentido; la condicional que acompaña a $P(A)$ es la de $B$ dado $A$.
- **Olvidar que la segunda etapa depende de la primera** cuando se extrae sin reemplazo.

:::figura[Con reemplazo, la segunda carta no depende de la primera y las dos ramas de la segunda etapa son iguales: dos ases tiene probabilidad 4/52 por 4/52, distinta de la del ejemplo sin reemplazo.]{componente="ProbabilityTree"}
```yaml
niveles: [Primera carta, Segunda carta]
ramas:
  - etiqueta: As
    prob: 0.0769230769
    ramas:
      - etiqueta: As
        prob: 0.0769230769
      - etiqueta: Otra
        prob: 0.9230769231
  - etiqueta: Otra
    prob: 0.9230769231
    ramas:
      - etiqueta: As
        prob: 0.0769230769
      - etiqueta: Otra
        prob: 0.9230769231
consultas:
  - nombre: Dos ases
    hojas: [As/As]
```
:::

:::figura[Multiplicar sin condicionar falla cuando hay dependencia: aquí P(tráfico) = 0.415, y 0.3 por 0.415 = 0.1245 no es el área real 0.24 del rectángulo de lluvia con tráfico.]{componente="ProbabilitySquare"}
```yaml
modo: independencia
particion:
  - etiqueta: Llueve
    prob: 0.3
  - etiqueta: No llueve
    prob: 0.7
evento: Tráfico
condicionales: [0.8, 0.25]
```
:::

## Conexiones

La regla del producto es la definición de [[probabilidad-condicional]] despejada. Repetida da la [[regla-de-la-cadena-de-probabilidad]], que es lo que se calcula al recorrer los caminos de los [[arboles-de-probabilidad]]. Sumando productos sobre una partición se obtiene la [[ley-de-probabilidad-total]], y la igualdad de los dos órdenes del producto es el [[teorema-de-bayes]]. Cuando la condicional no depende de la primera etapa se tiene [[independencia-de-eventos]].

## Formulario

:::formula[Regla del producto]
$$
P(A \cap B) = P(A)\,P(B \mid A)
$$

- $P(A)$: probabilidad de la primera etapa.
- $P(B \mid A)$: probabilidad de la segunda sabiendo que ocurrió la primera.
:::

:::formula[Forma simétrica]
$$
P(A)\,P(B \mid A) = P(B)\,P(A \mid B)
$$

- Ambos productos son $P(A \cap B)$.
:::

:::formula[Caso independiente]
$$
P(A \cap B) = P(A)\,P(B) \quad \text{si } P(B \mid A) = P(B)
$$

- La primera etapa no cambia la probabilidad de la segunda.
:::

:::formula[Dos ases sin reemplazo]
$$
P(\text{dos ases}) = \frac{4}{52} \cdot \frac{3}{51} = \frac{1}{221}
$$

- $4/52$: ases entre todas las cartas; $3/51$: ases restantes entre las cartas restantes.
:::
