---
id: interpretacion-subjetiva-o-bayesiana
titulo: Interpretación subjetiva o bayesiana
titulo_en: Subjective or Bayesian interpretation of probability
alias:
  - probabilidad subjetiva
  - probabilidad personal
  - grado de creencia
  - probabilidad como apuesta
modulo: 1
submodulo: '1.1'
orden: 6
nivel: basico
prerrequisitos:
  - eventos
relaciones:
  - tipo: contrasta
    id: interpretacion-frecuentista
  - tipo: contrasta
    id: interpretacion-clasica
etiquetas:
  - grado de creencia
  - apuestas
  - coherencia
  - de Finetti
resumen: >
  La probabilidad de un evento es el grado de creencia de una persona en que ocurra, medido como el
  precio justo de una apuesta que paga 1 si ocurre. Para ser coherente, debe cumplir los axiomas.
formula: 'P(A) = \text{precio justo de una apuesta que paga } 1 \text{ si ocurre } A'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: apuestas
    proposicion: mañana llueve en la ciudad
    creenciaA: 0.6
    creenciaNoA: 0.55
referencias:
  - clave: gelman-bda
    capitulo: '1'
  - clave: degroot
publicado: true
---

## Intuición

Un meteorólogo anuncia "70 % de probabilidad de lluvia para mañana". Mañana no se repetirá mil veces: lloverá o no. Ese 70 % expresa cuánto confía el meteorólogo en que llueva, con base en lo que sabe. La interpretación subjetiva, también llamada bayesiana, toma esta idea en serio: la probabilidad es un grado de creencia de alguien sobre algo, dada su información.

Para que un grado de creencia sea un número con significado, se le asocia con apuestas. Si una persona está dispuesta a pagar hasta 0.70 pesos por un boleto que paga 1 peso si llueve (y nada si no llueve), y a venderlo por ese mismo precio, su probabilidad de lluvia es 0.70. Personas con información distinta pueden tener probabilidades distintas sin que ninguna esté equivocada.

Lo que no es libre es la **coherencia**. Si alguien paga 0.70 por la apuesta a "llueve" y 0.50 por la apuesta a "no llueve", un adversario puede venderle ambas: la persona paga 1.20 y recibe exactamente 1 pase lo que pase, perdiendo 0.20 con certeza. Evitar esas pérdidas seguras obliga a que las creencias cumplan las mismas reglas que los axiomas de la probabilidad.

## Definición

:::definicion[Probabilidad subjetiva]
La **probabilidad subjetiva** $P(A)$ de una persona para un evento $A$ es el precio $q(A)$ que considera justo por un boleto que paga 1 si ocurre $A$ y 0 si no ocurre: está dispuesta tanto a comprarlo como a venderlo a ese precio.
:::

:::teorema[Coherencia, argumento del libro holandés]
Un conjunto de precios admite una combinación de apuestas que produce una pérdida segura (un **libro holandés**) si y solo si viola los axiomas de la probabilidad. En particular, para un evento $A$ y su complemento se requiere

$$
q(A) + q(A^{c}) = 1.
$$

:::

:::demostracion
Si $s = q(A) + q(A^{c}) > 1$, la persona compra los dos boletos por $s$; exactamente uno de ellos paga 1, así que termina con $1 - s < 0$ ocurra o no $A$. Si $s < 1$, la persona vende los dos boletos, cobra $s$ y paga exactamente 1: termina con $s - 1 < 0$. Solo con $s = 1$ ninguna de estas combinaciones produce pérdida segura.
:::

:::figura[Creencias coherentes: con q(A) = 0.3 y q(no A) = 0.7, el punto está sobre la diagonal y ninguna combinación de las dos apuestas produce una pérdida segura.]{componente="SampleSpaceLab"}

```yaml
modo: apuestas
proposicion: el equipo local gana el próximo partido
creenciaA: 0.3
creenciaNoA: 0.7
```

:::

:::nota[Qué significa cada símbolo]

- $A$: evento o proposición incierta, por ejemplo "mañana llueve"; $A^{c}$: su complemento, "mañana no llueve".
- $q(A)$: precio justo, para la persona, de un boleto que paga 1 si ocurre $A$.
- $P(A)$: probabilidad subjetiva de $A$, igual a $q(A)$.
- $s = q(A) + q(A^{c})$: precio total de los dos boletos.
- $1 - s$ o $s - 1$: ganancia neta segura de la persona al comprar o vender ambos boletos.
:::

## Cómo usar la visualización

El cuadrado de la izquierda tiene en los ejes los precios que una persona asigna a la apuesta por A y a la apuesta por no A. El punto se arrastra o se ajusta con los controles. La diagonal contiene las asignaciones coherentes, con suma 1. La animación muestra qué combinación de apuestas aprovecharía un adversario y la ganancia neta de la persona si ocurre A y si no ocurre.

Con los valores iniciales, 0.60 y 0.55, la suma es 1.15: la persona compra ambos boletos y pierde 0.15 en los dos escenarios. Al bajar el precio de no A hasta 0.40 el punto llega a la diagonal y las barras desaparecen. Con precios que suman menos de 1, por ejemplo 0.2 y 0.5, la persona vende ambos boletos y vuelve a perder con certeza.

## Ejemplo

Una inversionista cree que la probabilidad de que cierta empresa anuncie ganancias este trimestre es 0.65 y la de que no las anuncie es 0.45.

1. Precio total de los dos boletos: $0.65 + 0.45 = 1.10$.
2. Un corredor le vende ambos boletos a esos precios; ella paga 1.10.
3. Si la empresa anuncia ganancias, cobra 1 por el primer boleto y 0 por el segundo: neto $1 - 1.10 = -0.10$.
4. Si no las anuncia, cobra 0 por el primero y 1 por el segundo: neto $-0.10$.
5. Para ser coherente debe ajustar sus creencias de modo que sumen 1, por ejemplo 0.60 y 0.40. La interpretación subjetiva no dice cuál de las dos corregir; solo exige que sumen 1.

:::figura[Las creencias del ejemplo, 0.65 y 0.45, suman 1.10: comprando ambos boletos la inversionista pierde 0.10 en los dos escenarios.]{componente="SampleSpaceLab"}

```yaml
modo: apuestas
proposicion: la empresa anuncia ganancias este trimestre
creenciaA: 0.65
creenciaNoA: 0.45
```

:::

## Propiedades

- **Coherencia implica axiomas:** las creencias coherentes cumplen $0 \le P(A) \le 1$, $P(\Omega) = 1$ y la aditividad para eventos excluyentes. Por eso todo el cálculo de probabilidades aplica también a las probabilidades subjetivas.
- **Actualización con datos:** cuando llega información nueva, las creencias se revisan con el teorema de Bayes; así, dos personas con creencias iniciales distintas tienden a acercarse cuando observan los mismos datos abundantes.
- **Aplica a eventos únicos:** a diferencia de la [[interpretacion-frecuentista]], permite hablar de la probabilidad de eventos que no se repiten, como el resultado de una elección o el valor de una constante física.
- **Concordancia con la frecuencia:** si una persona cree que las repeticiones de un experimento son intercambiables, sus creencias sobre frecuencias futuras se acercan a las frecuencias observadas (teorema de De Finetti).

:::figura[La coherencia también se viola por defecto: con precios 0.20 y 0.50, que suman 0.70, un adversario le compra ambos boletos a la persona por 0.70 y ella debe pagar 1, perdiendo 0.30 con certeza.]{componente="SampleSpaceLab"}

```yaml
modo: apuestas
proposicion: el tren llega a tiempo
creenciaA: 0.2
creenciaNoA: 0.5
```

:::

## Errores comunes

- **Pensar que subjetivo significa arbitrario.** Las creencias pueden variar entre personas, pero deben ser coherentes y deben actualizarse con los datos según reglas precisas.
- **Asignar creencias por separado a un evento y a su complemento.** Es la forma más común de incoherencia: estimar 60 % de que un proyecto termine a tiempo y 50 % de que se retrase.
- **Creer que la probabilidad subjetiva es inútil en ciencia.** La estadística bayesiana la usa sistemáticamente, con creencias iniciales explícitas que los datos corrigen.

:::figura[Estimar por separado 60 % para "el proyecto termina a tiempo" y 50 % para "se retrasa" produce una suma de 1.10 y una pérdida segura de 0.10.]{componente="SampleSpaceLab"}

```yaml
modo: apuestas
proposicion: el proyecto termina a tiempo
creenciaA: 0.6
creenciaNoA: 0.5
```

:::

## Conexiones

La interpretación subjetiva comparte las reglas de los [[axiomas-de-kolmogorov]], que el argumento de coherencia justifica, pero se contrasta con la [[interpretacion-frecuentista]] y con la [[interpretacion-clasica]] en el significado de los números. Se aplica a [[eventos]] de cualquier tipo, repetibles o no. Es la base de la estadística bayesiana: el teorema de Bayes describe cómo se actualizan las creencias y el teorema de De Finetti conecta las creencias sobre sucesiones intercambiables con las frecuencias.

## Formulario

:::formula[Probabilidad como precio justo]

$$
P(A) = q(A)
$$

- $q(A)$: precio que la persona considera justo por un boleto que paga 1 si ocurre $A$.
:::

:::formula[Condición de coherencia para un evento y su complemento]

$$
q(A) + q(A^{c}) = 1
$$

- $A^{c}$: el evento "no ocurre $A$".
:::

:::formula[Pérdida segura con creencias incoherentes]

$$
\text{pérdida} = \big|\, q(A) + q(A^{c}) - 1 \,\big|
$$

- La persona compra ambos boletos si la suma excede 1 y los vende si es menor que 1; en los dos casos pierde esa cantidad ocurra o no $A$.
:::
