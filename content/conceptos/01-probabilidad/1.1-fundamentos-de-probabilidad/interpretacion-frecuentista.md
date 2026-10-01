---
id: interpretacion-frecuentista
titulo: Interpretación frecuentista
titulo_en: Frequentist interpretation of probability
alias:
  - probabilidad como frecuencia relativa
  - probabilidad a posteriori empírica
  - interpretación frecuencial
modulo: 1
submodulo: '1.1'
orden: 5
nivel: basico
prerrequisitos:
  - eventos
  - sucesiones
relaciones:
  - tipo: contrasta
    id: interpretacion-clasica
  - tipo: contrasta
    id: interpretacion-subjetiva-o-bayesiana
etiquetas:
  - frecuencia relativa
  - repetición
  - estabilidad
  - largo plazo
resumen: >
  La probabilidad de un evento es el valor al que se estabiliza su frecuencia relativa cuando el
  experimento se repite muchas veces en condiciones iguales.
formula: 'P(A) = \lim_{n \to \infty} \frac{n_A}{n}'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: frecuencia
    experimento: dos-dados
    eventoA: suma-7
    eventos: [suma-7, dobles, suma-mayor-9, al-menos-un-seis]
    trayectorias: 5
    banda: true
    escalaLog: true
    ensayos: 5000
referencias:
  - clave: wasserman
    capitulo: '1'
  - clave: degroot
publicado: true
---

## Intuición

Una aseguradora no sabe si un conductor en particular chocará este año, pero sabe que, de cada mil conductores de su perfil, cerca de 60 lo hacen. Ese 6 % no describe a nadie en particular: describe lo que pasa a la larga en una población grande. La interpretación frecuentista toma esta idea como definición: la probabilidad de un evento es la proporción de veces que ocurre en una serie muy larga de repeticiones.

Con pocas repeticiones la proporción oscila mucho: tres volados pueden dar tres caras. Con miles, la proporción se estabiliza y deja de moverse de manera apreciable. Ese valor estable es la probabilidad. Esta interpretación es la que sustenta buena parte de la estadística clásica: pruebas de hipótesis, intervalos de confianza y control de calidad.

Su límite es que solo tiene sentido para experimentos repetibles. La probabilidad de que un candidato gane una elección concreta, o de que una teoría física sea correcta, no es la frecuencia de nada. Además, "a la larga" nunca se alcanza: en la práctica se trabaja con un número finito de repeticiones y con la incertidumbre que eso implica.

## Definición

:::definicion[Probabilidad frecuentista]
Si un experimento aleatorio se repite $n$ veces en condiciones iguales e independientes, y el evento $A$ ocurre $n_A$ veces, la **frecuencia relativa** de $A$ es $f_n(A) = n_A / n$. La interpretación frecuentista define

$$
P(A) = \lim_{n \to \infty} f_n(A) = \lim_{n \to \infty} \frac{n_A}{n}.
$$

:::

Dentro de la teoría axiomática, esta convergencia no se postula sino que se demuestra: la ley de los grandes números garantiza que $f_n(A) \to P(A)$ con probabilidad 1 cuando las repeticiones son independientes. La interpretación frecuentista usa ese resultado para dar significado empírico al número $P(A)$.

:::figura[Una sola serie larga de lanzamientos de un dado, con eje logarítmico. La frecuencia relativa de "sale 1" oscila mucho en las primeras decenas de lanzamientos y después se estabiliza cerca de 1/6.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dado
eventoA: uno
eventos: [uno]
escalaLog: true
ensayos: 5000
```

:::

:::nota[Qué significa cada símbolo]

- $n$: número de repeticiones del experimento.
- $n_A$: número de repeticiones en que ocurrió el evento $A$.
- $f_n(A) = n_A / n$: frecuencia relativa de $A$ tras $n$ repeticiones.
- $\lim_{n \to \infty}$: valor al que se acerca la expresión cuando $n$ crece sin límite.
- $P(A)$: probabilidad del evento $A$.
- $\sqrt{P(A)(1 - P(A))/n}$: tamaño típico de la diferencia entre $f_n(A)$ y $P(A)$ (error estándar).
- $1.96$: factor que da una banda que contiene la frecuencia en el 95 % de las series.
  :::

## Cómo usar la visualización

Cinco series independientes de lanzamientos de dos dados avanzan a la vez. La rejilla cuenta cuántas veces sale cada par en la primera serie, y la gráfica, con eje logarítmico de ensayos, sigue la frecuencia relativa del evento en cada serie. La línea discontinua es la probabilidad exacta y la banda sombreada marca dónde cae la frecuencia el 95 % de las veces para cada $n$.

Al principio las cinco curvas son muy distintas y a veces salen de la banda. Conforme crece $n$ se juntan y la banda se estrecha. Si se cambia el evento a "sale al menos un 6", la probabilidad sube a $11/36 \approx 0.306$ y las curvas se reúnen alrededor de ese nuevo valor. Al desactivar el eje logarítmico se aprecia que la mayor parte del movimiento ocurre en los primeros cientos de ensayos.

## Ejemplo

Un laboratorio lanza 10000 veces una chincheta y cae con la punta hacia arriba 6180 veces.

1. Frecuencia relativa: $f_{10000} = 6180 / 10000 = 0.618$.
2. Error estándar aproximado: $\sqrt{0.618 \cdot 0.382 / 10000} \approx 0.0049$.
3. Banda de 95 %: $0.618 \pm 1.96 \cdot 0.0049$, es decir, de 0.608 a 0.628.
4. Interpretación frecuentista: la probabilidad de caer con la punta hacia arriba es aproximadamente 0.618; no hay simetría que permita calcularla con la regla de Laplace.

Para los dados de la visualización, $P(\text{suma} = 7) = 1/6$. Con $n = 100$ la banda de 95 % va de $0.094$ a $0.240$; con $n = 5000$, de $0.156$ a $0.177$.

:::figura[Diez mil repeticiones son necesarias para fijar dos decimales. Aquí, con la probabilidad conocida de 1/6, se ve cómo la banda de 95 % pasa de ser muy ancha con 100 lanzamientos a medir unas centésimas con 5000.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dos-dados
eventoA: suma-7
eventos: [suma-7]
banda: true
ensayos: 5000
```

:::

## Propiedades

- **Rango y aditividad:** como $0 \le n_A \le n$ y, para eventos excluyentes, $n_{A \cup B} = n_A + n_B$, las frecuencias relativas cumplen las mismas reglas que exigen los axiomas.
- **Tasa de convergencia:** la diferencia típica entre $f_n(A)$ y $P(A)$ es $\sqrt{P(A)(1 - P(A))/n}$. Para reducirla a la mitad hay que cuadruplicar las repeticiones.
- **Eventos raros:** si $P(A)$ es pequeña, se necesitan del orden de $1/P(A)$ repeticiones solo para observar $A$ algunas veces.
- **Resultado demostrable:** la convergencia de $f_n(A)$ es la ley de los grandes números, un teorema de la teoría axiomática.

:::figura[Ocho series independientes con la banda de 95 %. La anchura de la banda disminuye como uno entre la raíz de n: cuadruplicar los ensayos la reduce a la mitad.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: cuatro-monedas
eventoA: mas-caras
eventos: [mas-caras]
trayectorias: 8
banda: true
ensayos: 3000
```

:::

:::figura[Un evento raro: "la suma es 2" tiene probabilidad 1/36. Con pocas decenas de lanzamientos es común no observarlo ni una vez, y la frecuencia tarda mucho en acercarse a 0.028.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dos-dados
eventoA: suma-2
eventos: [suma-2]
trayectorias: 4
escalaLog: true
ensayos: 5000
```

:::

## Errores comunes

- **Tomar la frecuencia de pocas repeticiones como la probabilidad.** Con 20 lanzamientos, observar 6 sietes ($f = 0.3$) es perfectamente compatible con $P = 1/6$.
- **Creer que las diferencias absolutas se compensan.** Lo que se hace pequeño es la diferencia relativa $f_n(A) - P(A)$. La diferencia absoluta $n_A - n P(A)$ típicamente crece, como $\sqrt{n}$; no hay una fuerza que la regrese a cero.
- **Aplicarla a eventos únicos.** "La probabilidad de que llueva mañana" no es la frecuencia de ninguna serie de repeticiones idénticas; su interpretación requiere otro enfoque.

:::figura[Con 20 lanzamientos, las seis series muestran frecuencias de sietes muy distintas entre sí; ninguna de ellas es la probabilidad.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dos-dados
eventoA: suma-7
eventos: [suma-7]
trayectorias: 6
ensayos: 20
banda: true
```

:::

:::figura[El exceso absoluto de caras, número de caras menos n/2, no regresa a cero: la banda de 95 % se ensancha como la raíz de n. Lo que tiende a cero es la frecuencia relativa menos 1/2.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: moneda
eventoA: primera-cara
eventos: [primera-cara]
grafica: exceso
trayectorias: 5
banda: true
ensayos: 4000
```

:::

## Conexiones

La interpretación frecuentista da contenido empírico a los [[axiomas-de-kolmogorov]] y se apoya en la estabilidad observada al repetir un [[experimento-aleatorio]]. Coincide con la [[interpretacion-clasica]] cuando hay simetría, y se contrasta con la [[interpretacion-subjetiva-o-bayesiana]], que asigna probabilidades a eventos no repetibles. Es la base de la [[estimacion-de-probabilidades-por-simulacion-monte-carlo]], y su justificación matemática es la ley de los grandes números.

## Formulario

:::formula[Frecuencia relativa]

$$
f_n(A) = \frac{n_A}{n}
$$

- $n$: número de repeticiones; $n_A$: veces que ocurrió $A$.
  :::

:::formula[Probabilidad como límite]

$$
P(A) = \lim_{n \to \infty} f_n(A)
$$

- $\lim_{n \to \infty}$: valor al que tiende la frecuencia cuando las repeticiones crecen sin límite.
  :::

:::formula[Error estándar de la frecuencia]

$$
\mathrm{EE}\big(f_n(A)\big) = \sqrt{\frac{P(A)\,(1 - P(A))}{n}}
$$

- $\mathrm{EE}$: tamaño típico de la diferencia entre la frecuencia y la probabilidad.
- $P(A)$: probabilidad del evento; $n$: número de repeticiones.
  :::

:::formula[Banda de 95 %]

$$
P(A) \pm 1.96 \sqrt{\frac{P(A)\,(1 - P(A))}{n}}
$$

- $1.96$: cuantil de la normal estándar que deja 2.5 % en cada cola.
  :::

:::formula[Exceso absoluto]

$$
n_A - n\,P(A) \approx \pm 1.96\sqrt{n\,P(A)\,(1 - P(A))}
$$

- $n_A - n\,P(A)$: diferencia entre las ocurrencias observadas y las esperadas.
- $\sqrt{n\,P(A)(1 - P(A))}$: su tamaño típico, que crece con $n$.
  :::
