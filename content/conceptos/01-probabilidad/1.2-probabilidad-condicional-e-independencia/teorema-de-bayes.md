---
id: teorema-de-bayes
titulo: Teorema de Bayes
titulo_en: Bayes' theorem
alias:
  - regla de Bayes
  - fórmula de Bayes
  - probabilidad inversa
modulo: 1
submodulo: '1.2'
orden: 5
nivel: basico
prerrequisitos:
  - ley-de-probabilidad-total
relaciones:
  - tipo: relacionado
    id: tasa-base-y-falacia-de-la-tasa-base
  - tipo: relacionado
    id: interpretacion-subjetiva-o-bayesiana
etiquetas:
  - probabilidad inversa
  - actualización de creencias
  - a priori y a posteriori
  - inferencia
resumen: >
  Relaciona la probabilidad de una causa dada una evidencia con la probabilidad de la evidencia dada
  la causa, permitiendo actualizar creencias con datos.
formula: 'P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}'
visualizacion:
  componente: ProbabilitySquare
  parametros:
    modo: bayes
    particion:
      - etiqueta: Planta 1
        prob: 0.5
      - etiqueta: Planta 2
        prob: 0.3
      - etiqueta: Planta 3
        prob: 0.2
    evento: Defectuosa
    complemento: buena
    condicionales: [0.02, 0.05, 0.1]
    columna: 2
    contexto: Una pieza resultó defectuosa. ¿De qué planta viene?
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.3'
  - clave: gelman-bda
    capitulo: '1'
publicado: true
---

## Intuición

Una pieza salió defectuosa. La planta 3 solo produce el 20 % de las piezas, pero su tasa de defectos es la más alta. ¿Qué tan probable es que la pieza venga de ahí? La información conocida va en la dirección contraria: se sabe qué tan probable es un defecto dada la planta, y se quiere qué tan probable es la planta dado el defecto.

El teorema de Bayes invierte la condicional. La idea es sencilla si se piensa en el cuadrado de probabilidad: al saber que la pieza es defectuosa, todo lo que no es defectuoso se descarta. Quedan las piezas defectuosas de cada planta, y la probabilidad de cada planta es la fracción que ocupan sus piezas defectuosas dentro de ese nuevo espacio. La planta 3 aporta 0.020 de las 0.045 unidades de área defectuosa: 44 %, más del doble de su 20 % original.

El teorema describe cómo debe cambiar una creencia (la probabilidad a priori) al observar un dato: se multiplica por la verosimilitud del dato y se normaliza. Repetido con cada observación, es el mecanismo de aprendizaje de la estadística bayesiana.

## Definición

:::teorema[Teorema de Bayes]
Para eventos $A$ y $B$ con $P(A) > 0$ y $P(B) > 0$,
$$
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}.
$$
Si $A_1, \dots, A_k$ forman una partición con $P(A_i) > 0$,
$$
P(A_j \mid B) = \frac{P(B \mid A_j)\,P(A_j)}{\sum_{i=1}^{k} P(B \mid A_i)\,P(A_i)}.
$$
:::

:::demostracion
Por la regla del producto, $P(A \cap B) = P(B \mid A)\,P(A) = P(A \mid B)\,P(B)$. Dividiendo entre $P(B)$ se obtiene la primera forma; la segunda usa la ley de probabilidad total para escribir $P(B)$.
:::

Terminología: $P(A_j)$ es la probabilidad **a priori**, $P(B \mid A_j)$ la **verosimilitud** del dato bajo $A_j$, $P(A_j \mid B)$ la probabilidad **a posteriori** y $P(B)$ la **evidencia** o constante de normalización.

:::figura[El teorema como árbol: la consulta "Planta 3 dado defectuosa" divide el camino Planta 3 y Defectuosa (0.020) entre la suma de los tres caminos defectuosos (0.045).]{componente="ProbabilityTree"}
```yaml
niveles: [Planta, Pieza]
ramas:
  - etiqueta: Planta 1
    prob: 0.5
    ramas:
      - etiqueta: Defectuosa
        prob: 0.02
      - etiqueta: Buena
        prob: 0.98
  - etiqueta: Planta 2
    prob: 0.3
    ramas:
      - etiqueta: Defectuosa
        prob: 0.05
      - etiqueta: Buena
        prob: 0.95
  - etiqueta: Planta 3
    prob: 0.2
    ramas:
      - etiqueta: Defectuosa
        prob: 0.1
      - etiqueta: Buena
        prob: 0.9
consultas:
  - nombre: Planta 3 dado defectuosa
    hojas: [Planta 3/Defectuosa]
    condicion: [Planta 1/Defectuosa, Planta 2/Defectuosa, Planta 3/Defectuosa]
  - nombre: Planta 1 dado defectuosa
    hojas: [Planta 1/Defectuosa]
    condicion: [Planta 1/Defectuosa, Planta 2/Defectuosa, Planta 3/Defectuosa]
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$: eventos; $A$ suele ser una hipótesis o causa y $B$ un dato observado.
- $P(A)$: probabilidad a priori de $A$, antes de ver el dato.
- $P(B \mid A)$: verosimilitud, probabilidad del dato si $A$ es cierto.
- $P(B)$: probabilidad total del dato, la evidencia.
- $P(A \mid B)$: probabilidad a posteriori de $A$ después de ver el dato.
- $A_1, \dots, A_k$: hipótesis que forman una partición; $j$ indica la hipótesis de interés.
- $\propto$: "proporcional a"; la a posteriori es proporcional a verosimilitud por a priori.
:::

## Cómo usar la visualización

El cuadrado tiene una columna por planta, con su proporción de producción como ancho y su tasa de defectos como altura de la parte inferior. La animación primero suma las tres partes inferiores, $P(\text{defectuosa}) = 0.045$; después descarta las piezas buenas, y al final lleva las tres piezas defectuosas a un cuadrado nuevo donde llenan toda la altura: sus anchos son las probabilidades a posteriori.

La planta 3 pasa de 20 % a 44 %, la planta 1 de 50 % a 22 % y la planta 2 de 30 % a 33 %. Al bajar la tasa de defectos de la planta 3 al 2 %, igual que la planta 1, su probabilidad a posteriori baja; si todas las tasas son iguales, las a posteriori coinciden con las a priori: el defecto no informa nada sobre la planta.

## Ejemplo

Una prueba de detección de una enfermedad con prevalencia de 1 % tiene sensibilidad de 95 % ($P(+ \mid E) = 0.95$) y una tasa de falsos positivos de 10 % ($P(+ \mid E^{c}) = 0.10$). Una persona da positivo. ¿Qué probabilidad hay de que esté enferma?

1. A priori: $P(E) = 0.01$, $P(E^{c}) = 0.99$.
2. Evidencia: $P(+) = 0.95 \cdot 0.01 + 0.10 \cdot 0.99 = 0.0095 + 0.099 = 0.1085$.
3. Bayes: $P(E \mid +) = \dfrac{0.95 \cdot 0.01}{0.1085} = \dfrac{0.0095}{0.1085} \approx 0.088$.
4. Aunque la prueba es buena, menos de 9 % de los positivos están enfermos, porque la enfermedad es rara y los falsos positivos de la gran mayoría sana superan a los verdaderos positivos.

:::figura[El ejemplo como cuadrado: la columna "Enfermo" es muy angosta (1 %). Al condicionar en positivo, su pieza ocupa solo el 9 % del nuevo cuadrado.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: Enfermo
    prob: 0.01
  - etiqueta: Sano
    prob: 0.99
evento: Positivo
complemento: negativo
condicionales: [0.95, 0.1]
```
:::

## Propiedades

- **Proporcionalidad:** $P(A_j \mid B) \propto P(B \mid A_j)\,P(A_j)$; el denominador solo normaliza para que las a posteriori sumen 1.
- **Actualización secuencial:** con datos condicionalmente independientes, la a posteriori después de un dato es la a priori para el siguiente, y el resultado no depende del orden de los datos.
- **Razón de momios:** $\dfrac{P(A \mid B)}{P(A^{c} \mid B)} = \dfrac{P(B \mid A)}{P(B \mid A^{c})}\cdot\dfrac{P(A)}{P(A^{c})}$: los momios a posteriori son la razón de verosimilitudes por los momios a priori.
- **Dato no informativo:** si $P(B \mid A_i)$ es igual para todas las hipótesis, las a posteriori son iguales a las a priori.

:::figura[Actualización secuencial: ¿la moneda está equilibrada o cargada hacia cara (80 %)? Cada observación multiplica por la verosimilitud y normaliza; tras varias caras, la hipótesis "Cargada" domina.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: Equilibrada
    prior: 0.5
  - nombre: Cargada
    prior: 0.5
observaciones:
  - nombre: Cara
    verosimilitudes: [0.5, 0.8]
  - nombre: Cruz
    verosimilitudes: [0.5, 0.2]
secuencia: [Cara, Cara, Cruz, Cara, Cara, Cara]
```
:::

:::figura[Dos pruebas positivas seguidas: con la prueba del ejemplo, un segundo positivo eleva la probabilidad de enfermedad de 0.088 a cerca de 0.48.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: Enfermo
    prior: 0.01
  - nombre: Sano
    prior: 0.99
observaciones:
  - nombre: Positivo
    verosimilitudes: [0.95, 0.1]
  - nombre: Negativo
    verosimilitudes: [0.05, 0.9]
secuencia: [Positivo, Positivo]
```
:::

## Errores comunes

- **Confundir $P(A \mid B)$ con $P(B \mid A)$.** La sensibilidad de la prueba (0.95) no es la probabilidad de estar enfermo dado un positivo (0.088). Esta confusión, llamada falacia del fiscal en contextos judiciales, es la más frecuente.
- **Ignorar la a priori.** Con una prevalencia de 1 %, incluso pruebas muy buenas producen más falsos que verdaderos positivos; es la falacia de la tasa base.
- **Olvidar normalizar.** El producto $P(B \mid A)\,P(A)$ no es la a posteriori; hay que dividir entre la suma sobre todas las hipótesis.

:::figura[La tasa base en 1000 personas: 10 enfermas, de las que 9 dan positivo, frente a 50 falsos positivos entre las 990 sanas. De los 59 positivos, solo 9 están enfermos.]{componente="IconArray"}
```yaml
poblacion: 1000
prevalencia: 0.01
sensibilidad: 0.9
especificidad: 0.95
condicion: tiene la enfermedad
```
:::

## Conexiones

El teorema se obtiene de la [[regla-del-producto]] y la [[ley-de-probabilidad-total]], y se calcula de forma natural con [[arboles-de-probabilidad]]. Sus aplicaciones directas incluyen las [[pruebas-diagnosticas]], la [[tasa-base-y-falacia-de-la-tasa-base]], el [[problema-de-monty-hall]] y el [[problema-de-los-tres-prisioneros]]. Es el fundamento de la [[interpretacion-subjetiva-o-bayesiana]] y de toda la estadística bayesiana, donde las hipótesis se vuelven parámetros con distribuciones a priori y a posteriori.

## Formulario

:::formula[Teorema de Bayes]
$$
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
$$

- $P(A)$: a priori; $P(B \mid A)$: verosimilitud; $P(B)$: evidencia; $P(A \mid B)$: a posteriori.
:::

:::formula[Con una partición]
$$
P(A_j \mid B) = \frac{P(B \mid A_j)\,P(A_j)}{\sum_{i=1}^{k} P(B \mid A_i)\,P(A_i)}
$$

- $A_1, \dots, A_k$: hipótesis excluyentes que cubren todos los casos.
:::

:::formula[Forma proporcional]
$$
P(A_j \mid B) \propto P(B \mid A_j)\,P(A_j)
$$

- $\propto$: igual salvo una constante que hace sumar 1.
:::

:::formula[Forma de momios]
$$
\frac{P(A \mid B)}{P(A^{c} \mid B)} = \frac{P(B \mid A)}{P(B \mid A^{c})}\cdot\frac{P(A)}{P(A^{c})}
$$

- Momios: cociente entre la probabilidad de un evento y la de su complemento.
- $\frac{P(B \mid A)}{P(B \mid A^{c})}$: razón de verosimilitudes del dato.
:::
