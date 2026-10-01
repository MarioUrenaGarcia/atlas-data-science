---
id: tasa-base-y-falacia-de-la-tasa-base
titulo: Tasa base y falacia de la tasa base
titulo_en: Base rate and base rate fallacy
alias:
  - falacia de la tasa base
  - descuido de la tasa base
  - probabilidad a priori ignorada
modulo: 1
submodulo: '1.2'
orden: 7
nivel: basico
prerrequisitos:
  - teorema-de-bayes
relaciones:
  - tipo: relacionado
    id: pruebas-diagnosticas
etiquetas:
  - prevalencia
  - sesgos de razonamiento
  - probabilidad a priori
  - frecuencias naturales
resumen: >
  La tasa base es la proporción de casos de una condición en la población. Ignorarla al interpretar
  una evidencia, juzgando solo por qué tan bien la evidencia distingue los casos, es la falacia de la tasa base.
formula: 'P(H \mid E) = \frac{P(E \mid H)\,P(H)}{P(E \mid H)\,P(H) + P(E \mid H^{c})\,P(H^{c})}'
visualizacion:
  componente: IconArray
  parametros:
    poblacion: 100
    prevalencia: 0.15
    sensibilidad: 0.8
    especificidad: 0.8
    condicion: es un taxi azul
    positivo: el testigo dice que es azul
    contexto: En una ciudad, 85 % de los taxis son verdes y 15 % azules. Un testigo identifica bien el color el 80 % de las veces y dice que el taxi de un accidente era azul.
referencias:
  - clave: blitzstein-hwang
    capitulo: '2'
  - clave: mcelreath
publicado: true
---

## Intuición

Un taxi estuvo involucrado en un accidente nocturno. En la ciudad, 85 % de los taxis son verdes y 15 % azules. Un testigo dice que el taxi era azul, y las pruebas muestran que en esas condiciones identifica correctamente el color el 80 % de las veces. La respuesta intuitiva es que el taxi era azul con probabilidad cercana a 0.8. La correcta es 0.41.

La diferencia está en la **tasa base**: hay muchos más taxis verdes que azules. Entre 100 taxis, 15 son azules y el testigo diría "azul" para 12 de ellos; pero también diría "azul", por error, para 17 de los 85 verdes. De los 29 taxis que el testigo llamaría azules, solo 12 lo son.

La **falacia de la tasa base** consiste en juzgar la probabilidad de una hipótesis solo por qué tan bien la evidencia la distingue, sin tomar en cuenta qué tan común era la hipótesis antes de la evidencia. Es un error documentado en médicos, jueces y jurados, y aparece cada vez que se busca algo raro: enfermedades poco frecuentes, fraudes, fallas de equipo o amenazas de seguridad.

## Definición

:::definicion[Tasa base]
La **tasa base** de una condición $H$ es su probabilidad antes de observar evidencia, $P(H)$, usualmente la proporción de la población que la cumple (prevalencia).
:::

:::definicion[Falacia de la tasa base]
Error que consiste en estimar $P(H \mid E)$ usando solo la calidad de la evidencia, por ejemplo $P(E \mid H)$, ignorando $P(H)$. La respuesta correcta, por el teorema de Bayes, es
$$
P(H \mid E) = \frac{P(E \mid H)\,P(H)}{P(E \mid H)\,P(H) + P(E \mid H^{c})\,P(H^{c})}.
$$
:::

:::figura[El caso del taxi como cuadrado: la columna de taxis azules es angosta (15 %). Al condicionar en "el testigo dice azul", los verdes mal identificados ocupan más espacio que los azules bien identificados.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: Azul
    prob: 0.15
  - etiqueta: Verde
    prob: 0.85
evento: Dice azul
complemento: dice verde
condicionales: [0.8, 0.2]
```
:::

:::nota[Qué significa cada símbolo]
- $H$: hipótesis o condición (el taxi es azul, la persona está enferma); $H^{c}$: su complemento.
- $E$: evidencia observada (el testigo dice azul, la prueba sale positiva).
- $P(H)$: tasa base o probabilidad a priori de $H$.
- $P(E \mid H)$: probabilidad de la evidencia si $H$ es cierta.
- $P(E \mid H^{c})$: probabilidad de la evidencia si $H$ es falsa (tasa de falsas alarmas).
- $P(H \mid E)$: probabilidad de $H$ después de ver la evidencia.
:::

## Cómo usar la visualización

Cada figura es uno de 100 taxis. La animación los colorea en etapas: primero marca los 15 azules, después enmarca aquellos que el testigo llamaría azules (12 azules y 17 verdes) y al final deja visibles solo los enmarcados: de 29, 12 son azules, es decir, $12/29 \approx 0.41$.

Al bajar la tasa base a 0.05 la probabilidad cae a cerca de 0.17 aunque el testigo sea igual de confiable. Al subir la confiabilidad a 0.95, los falsos "azul" se reducen a 4 y la probabilidad sube a 0.77: con una tasa base baja, solo una evidencia muy precisa compensa.

## Ejemplo

Un sistema antifraude marca transacciones sospechosas. El 0.1 % de las transacciones es fraudulento; el sistema detecta el 99 % de los fraudes y marca por error el 2 % de las transacciones legítimas. ¿Qué proporción de las transacciones marcadas es fraude?

1. En 100000 transacciones: 100 fraudulentas y 99900 legítimas.
2. Fraudes marcados: $0.99 \cdot 100 = 99$.
3. Legítimas marcadas: $0.02 \cdot 99900 = 1998$.
4. $P(\text{fraude} \mid \text{marcada}) = \dfrac{99}{99 + 1998} = \dfrac{99}{2097} \approx 0.047$.
5. Menos del 5 % de las alertas son fraudes reales. Ignorar la tasa base llevaría a pensar que casi todas lo son.

:::figura[El sistema antifraude escalado a 1000 transacciones con una tasa base de 1 %: de las 30 alertas, solo 10 son fraudes. Con la tasa real de 0.1 % la proporción es todavía menor.]{componente="IconArray"}
```yaml
poblacion: 1000
prevalencia: 0.01
sensibilidad: 0.99
especificidad: 0.98
condicion: es un fraude
positivo: el sistema la marca
```
:::

## Propiedades

- **Efecto de la tasa base:** con evidencia de calidad fija, $P(H \mid E)$ crece con $P(H)$; cuando $P(H)$ tiende a 0, también lo hace $P(H \mid E)$.
- **Forma de momios:** los momios a posteriori son la razón de verosimilitudes por los momios a priori. Con momios a priori de 15 a 85 y razón $0.8/0.2 = 4$, los momios a posteriori son $4 \cdot 15/85 = 60/85$, es decir, probabilidad $60/145 \approx 0.41$.
- **Frecuencias naturales:** expresar los datos como conteos de personas o casos (12 de 29) reduce mucho la falacia frente a la presentación en porcentajes condicionales.
- **Repetir la evidencia ayuda:** un segundo testimonio independiente usa 0.41 como nueva tasa base y eleva la probabilidad.

:::figura[La misma evidencia con tasas base distintas: con 50 % de taxis azules, el testimonio daría 0.8; aquí, con la tasa real de 15 %, la a posteriori es 0.41, y un segundo testigo independiente que también dice azul la sube a 0.74.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: Azul
    prior: 0.15
  - nombre: Verde
    prior: 0.85
observaciones:
  - nombre: Dice azul
    verosimilitudes: [0.8, 0.2]
  - nombre: Dice verde
    verosimilitudes: [0.2, 0.8]
secuencia: [Dice azul, Dice azul]
```
:::

:::figura[Con una tasa base de 50 %, el mismo testigo sí da una probabilidad de 0.8: la tasa base es lo que separa el 0.8 intuitivo del 0.41 correcto.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: Azul
    prob: 0.5
  - etiqueta: Verde
    prob: 0.5
evento: Dice azul
complemento: dice verde
condicionales: [0.8, 0.2]
```
:::

## Errores comunes

- **Tomar la confiabilidad de la evidencia como la probabilidad de la hipótesis.** "El testigo acierta 80 %" no implica "80 % de que el taxi fuera azul".
- **Desconfiar de la tasa base por ser "estadística" y no "del caso".** La tasa base es información sobre el caso: describe de qué población salió.
- **Aplicar una tasa base de la población equivocada.** Si el accidente ocurrió en una zona donde casi solo circulan taxis azules, la tasa base relevante es la de esa zona.

:::figura[Una tasa base muy baja (0.5 %) con una prueba buena (sensibilidad y especificidad de 0.95): de 1000 personas, 5 tienen la condición y unas 50 dan falso positivo, de modo que casi todos los positivos están sanos.]{componente="IconArray"}
```yaml
poblacion: 1000
prevalencia: 0.005
sensibilidad: 0.95
especificidad: 0.95
condicion: tiene la condición
```
:::

## Conexiones

La falacia de la tasa base es la omisión del término $P(H)$ en el [[teorema-de-bayes]]. Su contexto más importante son las [[pruebas-diagnosticas]], donde la tasa base es la prevalencia. Está relacionada con la confusión entre $P(A \mid B)$ y $P(B \mid A)$ de la [[probabilidad-condicional]] y con la [[interpretacion-subjetiva-o-bayesiana]], en la que la tasa base es la creencia a priori. En estadística, el mismo problema aparece en las pruebas de hipótesis múltiples, donde la proporción de hipótesis verdaderas determina cuántos hallazgos son falsos.

## Formulario

:::formula[Probabilidad a posteriori con tasa base]
$$
P(H \mid E) = \frac{P(E \mid H)\,P(H)}{P(E \mid H)\,P(H) + P(E \mid H^{c})\,P(H^{c})}
$$

- $P(H)$: tasa base; $P(E \mid H)$ y $P(E \mid H^{c})$: comportamiento de la evidencia en cada caso.
:::

:::formula[Forma de momios]
$$
\frac{P(H \mid E)}{P(H^{c} \mid E)} = \frac{P(E \mid H)}{P(E \mid H^{c})}\cdot\frac{P(H)}{P(H^{c})}
$$

- $\frac{P(H)}{P(H^{c})}$: momios a priori, determinados por la tasa base.
:::

:::formula[Con frecuencias naturales]
$$
P(H \mid E) = \frac{\text{casos con } H \text{ y } E}{\text{casos con } E}
$$

- Los conteos se obtienen multiplicando el tamaño de la población por las probabilidades.
:::
